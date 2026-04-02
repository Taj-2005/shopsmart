from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.http import require_POST
from .models import Note


def note_list(request):
    notes = Note.objects.all()
    return render(request, "notes/list.html", {"notes": notes})


@require_POST
def note_create(request):
    title = request.POST.get("title", "").strip()
    content = request.POST.get("content", "").strip()
    if title and content:
        Note.objects.create(title=title, content=content)
    return redirect("note_list")


@require_POST
def note_delete(request, pk):
    note = get_object_or_404(Note, pk=pk)
    note.delete()
    return redirect("note_list")
