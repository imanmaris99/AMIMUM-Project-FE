export class RequestGeneration {
  private generation = 0;

  begin(): number {
    this.generation += 1;
    return this.generation;
  }

  current(): number {
    return this.generation;
  }

  isCurrent(generation: number): boolean {
    return this.generation === generation;
  }
}
