import { TemplateData } from './types';

export class HistoryManager {
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private maxHistory: number = 30;

  constructor(initialState?: TemplateData) {
    if (initialState) {
      this.undoStack.push(JSON.stringify(initialState));
    }
  }

  public record(state: TemplateData) {
    const serialized = JSON.stringify(state);
    const last = this.undoStack[this.undoStack.length - 1];
    if (last === serialized) return; // No duplicar si no cambió nada
    this.undoStack.push(serialized);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Limpiar rehacer cuando hay una nueva acción
  }

  public undo(currentState: TemplateData): TemplateData | null {
    if (this.undoStack.length === 0) return null;
    const currentSerialized = JSON.stringify(currentState);
    this.redoStack.push(currentSerialized);

    const prevSerialized = this.undoStack.pop();
    if (!prevSerialized) return null;

    // Si el tope es idéntico al actual, sacamos el anterior
    if (prevSerialized === currentSerialized && this.undoStack.length > 0) {
      const realPrev = this.undoStack.pop();
      return realPrev ? JSON.parse(realPrev) : null;
    }

    return JSON.parse(prevSerialized);
  }

  public redo(currentState: TemplateData): TemplateData | null {
    if (this.redoStack.length === 0) return null;
    const nextSerialized = this.redoStack.pop();
    if (!nextSerialized) return null;

    this.undoStack.push(JSON.stringify(currentState));
    return JSON.parse(nextSerialized);
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
