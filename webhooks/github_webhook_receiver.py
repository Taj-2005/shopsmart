#!/usr/bin/env python3
"""
GitHub Webhook Receiver - DevOps Teaching Demo
==============================================

This Flask app demonstrates how GitHub webhooks work by:
1. Receiving webhook POST requests from GitHub
2. Validating the signature (security!)
3. Auto-deploying code on push events

Setup Instructions:
-------------------
1. Install dependencies:
   pip install flask

2. Set your webhook secret as an environment variable:
   export GITHUB_WEBHOOK_SECRET='NSTSECRET'

3. Run the server:
   python github_webhook_receiver.py

4. In your GitHub repo settings, add a webhook:
   - Payload URL: http://your-ec2-ip:5000/webhook
   - Content type: application/json
   - Secret: same secret you set above
   - Events: Just the push event (for this demo)

Architecture:
-------------
    [Developer pushes code]
            |
            v
    [GitHub detects push]
            |
            v
    [GitHub sends POST to your webhook URL]
            |
            v
    [This Flask app receives it]
            |
            v
    [Validates signature using HMAC-SHA256]
            |
            v
    [Runs deploy script / git pull]
            |
            v
    [Application updated!]
"""

import hashlib
import hmac
import json
import os
import subprocess
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

# Configuration
WEBHOOK_SECRET = os.environ.get('GITHUB_WEBHOOK_SECRET', 'dev-secret-change-me')
REPO_PATH = os.environ.get('REPO_PATH', '/opt/myapp')  # Where your repo is cloned
LOG_FILE = 'webhook_events.log'


def log_event(message: str):
    """Simple file logger so students can review what happened."""
    timestamp = datetime.now().isoformat()
    log_line = f"[{timestamp}] {message}\n"
    print(log_line, end='')  # Also print to console
    with open(LOG_FILE, 'a') as f:
        f.write(log_line)


def verify_signature(payload_body: bytes, signature_header: str) -> bool:
    """
    Verify that the webhook payload was sent by GitHub.
    
    GitHub signs each webhook payload using HMAC-SHA256 with your secret.
    This prevents attackers from sending fake webhook events to your server.
    
    How it works:
    1. GitHub computes: HMAC-SHA256(secret, payload) and sends it in the header
    2. We compute the same thing with our copy of the secret
    3. If they match, the request is authentic
    
    This is the same principle used in JWTs, API signatures, etc.
    """
    if not signature_header:
        return False
    
    # GitHub sends: "sha256=abc123..."
    # We need just the hash part
    if not signature_header.startswith('sha256='):
        return False
    
    expected_signature = signature_header[7:]  # Remove 'sha256=' prefix
    
    # Compute our own signature
    computed_signature = hmac.new(
        key=WEBHOOK_SECRET.encode('utf-8'),
        msg=payload_body,
        digestmod=hashlib.sha256
    ).hexdigest()
    
    # Use compare_digest to prevent timing attacks
    # (constant-time comparison)
    return hmac.compare_digest(expected_signature, computed_signature)


def deploy():
    """
    Run the deployment steps.
    
    In production, this might:
    - Pull latest code
    - Install dependencies
    - Run database migrations
    - Restart services
    - Notify Slack/Discord
    
    For this demo, we just do a git pull.
    """
    log_event(f"Starting deployment in {REPO_PATH}")
    
    try:
        # Change to repo directory and pull
        result = subprocess.run(
            ['git', 'pull', 'origin', 'main'],
            cwd=REPO_PATH,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            log_event(f"Deploy SUCCESS: {result.stdout.strip()}")
            return True, result.stdout
        else:
            log_event(f"Deploy FAILED: {result.stderr.strip()}")
            return False, result.stderr
            
    except FileNotFoundError:
        msg = f"Repo path {REPO_PATH} does not exist"
        log_event(f"Deploy FAILED: {msg}")
        return False, msg
    except subprocess.TimeoutExpired:
        msg = "Deploy timed out after 60 seconds"
        log_event(f"Deploy FAILED: {msg}")
        return False, msg


# =============================================================================
# Routes
# =============================================================================

@app.route('/')
def index():
    """Health check endpoint."""
    return jsonify({
        'status': 'running',
        'service': 'GitHub Webhook Receiver',
        'endpoints': {
            '/': 'This health check',
            '/webhook': 'POST - GitHub webhook receiver',
            '/events': 'GET - View recent webhook events'
        }
    })


@app.route('/webhook', methods=['POST'])
def webhook():
    """
    Main webhook endpoint - GitHub sends POST requests here.
    
    Try sending a test webhook from GitHub's settings page
    to see this in action!
    """
    # Step 1: Get the signature from headers
    signature = request.headers.get('X-Hub-Signature-256')
    
    # Step 2: Verify the signature
    if not verify_signature(request.data, signature):
        log_event("REJECTED: Invalid signature")
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Step 3: Parse the payload
    try:
        payload = request.json
    except Exception as e:
        log_event(f"REJECTED: Invalid JSON payload - {e}")
        return jsonify({'error': 'Invalid JSON'}), 400
    
    # Step 4: Identify the event type
    event_type = request.headers.get('X-GitHub-Event', 'unknown')
    delivery_id = request.headers.get('X-GitHub-Delivery', 'unknown')
    
    log_event(f"Received event: {event_type} (delivery: {delivery_id})")
    
    # Step 5: Handle different event types
    if event_type == 'ping':
        # GitHub sends this when you first set up the webhook
        log_event("Ping received - webhook is configured correctly!")
        return jsonify({'message': 'pong'})
    
    elif event_type == 'push':
        # Someone pushed code!
        branch = payload.get('ref', '').replace('refs/heads/', '')
        pusher = payload.get('pusher', {}).get('name', 'unknown')
        commits = payload.get('commits', [])
        repo_name = payload.get('repository', {}).get('full_name', 'unknown')
        
        log_event(f"Push to {repo_name}/{branch} by {pusher} ({len(commits)} commits)")
        
        # Log each commit
        for commit in commits[:5]:  # Limit to 5 to avoid log spam
            msg = commit.get('message', '').split('\n')[0][:50]
            author = commit.get('author', {}).get('name', 'unknown')
            log_event(f"  - {commit.get('id', '')[:7]}: {msg} ({author})")
        
        # Only deploy on main branch (customize as needed)
        if branch == 'main':
            success, output = deploy()
            return jsonify({
                'event': 'push',
                'branch': branch,
                'deployed': success,
                'output': output
            })
        else:
            log_event(f"Skipping deploy - branch is {branch}, not main")
            return jsonify({
                'event': 'push',
                'branch': branch,
                'deployed': False,
                'reason': 'Not the main branch'
            })
    
    elif event_type == 'pull_request':
        # PR opened, closed, merged, etc.
        action = payload.get('action')
        pr = payload.get('pull_request', {})
        pr_number = pr.get('number')
        pr_title = pr.get('title')
        user = pr.get('user', {}).get('login')
        
        log_event(f"PR #{pr_number} {action} by {user}: {pr_title}")
        
        return jsonify({
            'event': 'pull_request',
            'action': action,
            'pr_number': pr_number
        })
    
    else:
        # Handle other events (issues, releases, etc.)
        log_event(f"Received {event_type} event (no handler)")
        return jsonify({
            'event': event_type,
            'handled': False
        })


@app.route('/events')
def view_events():
    """View recent webhook events - useful for debugging."""
    try:
        with open(LOG_FILE, 'r') as f:
            events = f.readlines()[-50:]  # Last 50 lines
        return '<pre>' + ''.join(events) + '</pre>'
    except FileNotFoundError:
        return '<pre>No events logged yet.</pre>'


# =============================================================================
# Main
# =============================================================================

if __name__ == '__main__':
    print("""
    ╔═══════════════════════════════════════════════════════════════╗
    ║           GitHub Webhook Receiver - DevOps Demo               ║
    ╠═══════════════════════════════════════════════════════════════╣
    ║  Endpoints:                                                   ║
    ║    GET  /          - Health check                             ║
    ║    POST /webhook   - GitHub webhook receiver                  ║
    ║    GET  /events    - View logged events                       ║
    ╠═══════════════════════════════════════════════════════════════╣
    ║  Environment Variables:                                       ║
    ║    GITHUB_WEBHOOK_SECRET - Your webhook secret                ║
    ║    REPO_PATH            - Path to your git repo               ║
    ╚═══════════════════════════════════════════════════════════════╝
    """)
    
    # Warning if using default secret
    if WEBHOOK_SECRET == 'dev-secret-change-me':
        print("⚠️  WARNING: Using default webhook secret!")
        print("   Set GITHUB_WEBHOOK_SECRET environment variable.\n")
    
    # Run the server
    # In production, use gunicorn or similar instead
    app.run(host='0.0.0.0', port=3000, debug=True)
