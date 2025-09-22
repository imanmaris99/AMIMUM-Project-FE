// Advanced State Management System
import { useCallback, useMemo, useRef, useEffect } from 'react';

// State management types
export interface StateAction<T = any> {
  type: string;
  payload?: T;
  meta?: Record<string, any>;
}

export interface StateReducer<T> {
  (state: T, action: StateAction): T;
}

export interface StateStore<T> {
  getState(): T;
  dispatch(action: StateAction): void;
  subscribe(listener: (state: T) => void): () => void;
}

// Advanced state store implementation
export class AdvancedStateStore<T> implements StateStore<T> {
  private state: T;
  private listeners: Set<(state: T) => void> = new Set();
  private reducers: Map<string, StateReducer<T>> = new Map();
  private middleware: Array<(action: StateAction, next: () => void) => void> = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  dispatch(action: StateAction): void {
    // Apply middleware
    let index = 0;
    const next = () => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        middleware(action, next);
      } else {
        this.applyAction(action);
      }
    };
    next();
  }

  private applyAction(action: StateAction): void {
    const reducer = this.reducers.get(action.type);
    if (reducer) {
      const newState = reducer(this.state, action);
      if (newState !== this.state) {
        this.state = newState;
        this.notifyListeners();
      }
    }
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  addReducer(type: string, reducer: StateReducer<T>): void {
    this.reducers.set(type, reducer);
  }

  addMiddleware(middleware: (action: StateAction, next: () => void) => void): void {
    this.middleware.push(middleware);
  }
}

// React hook for state management
export function useStateStore<T>(store: StateStore<T>): [T, (action: StateAction) => void] {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, [store]);

  const dispatch = useCallback((action: StateAction) => {
    store.dispatch(action);
  }, [store]);

  return [state, dispatch];
}

// State persistence
export class StatePersistence {
  private static readonly STORAGE_PREFIX = 'amimum_state_';

  static save<T>(key: string, state: T): void {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(this.STORAGE_PREFIX + key, serialized);
    } catch (error) {
    }
  }

  static load<T>(key: string, defaultValue: T): T {
    try {
      const serialized = localStorage.getItem(this.STORAGE_PREFIX + key);
      if (serialized) {
        return JSON.parse(serialized);
      }
    } catch (error) {
    }
    return defaultValue;
  }

  static remove(key: string): void {
    localStorage.removeItem(this.STORAGE_PREFIX + key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.STORAGE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

// State synchronization
export class StateSynchronizer {
  private static instances: Map<string, StateSynchronizer> = new Map();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  static getInstance(key: string): StateSynchronizer {
    if (!this.instances.has(key)) {
      this.instances.set(key, new StateSynchronizer());
    }
    return this.instances.get(key)!;
  }

  subscribe(channel: string, listener: (data: any) => void): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)!.add(listener);

    return () => {
      this.listeners.get(channel)?.delete(listener);
    };
  }

  publish(channel: string, data: any): void {
    this.listeners.get(channel)?.forEach(listener => listener(data));
  }
}

// Optimistic updates
export class OptimisticUpdater<T> {
  private store: StateStore<T>;
  private pendingActions: Map<string, { action: StateAction; timestamp: number }> = new Map();

  constructor(store: StateStore<T>) {
    this.store = store;
  }

  optimisticUpdate(action: StateAction, optimisticState: T, rollbackAction: StateAction): string {
    const id = `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store original state
    const originalState = this.store.getState();
    
    // Apply optimistic update
    this.store.dispatch(action);
    
    // Store rollback information
    this.pendingActions.set(id, {
      action: rollbackAction,
      timestamp: Date.now()
    });

    // Auto-rollback after timeout
    setTimeout(() => {
      if (this.pendingActions.has(id)) {
        this.rollback(id);
      }
    }, 30000); // 30 seconds timeout

    return id;
  }

  confirmUpdate(id: string): void {
    this.pendingActions.delete(id);
  }

  rollback(id: string): void {
    const pending = this.pendingActions.get(id);
    if (pending) {
      this.store.dispatch(pending.action);
      this.pendingActions.delete(id);
    }
  }

  rollbackAll(): void {
    this.pendingActions.forEach((_, id) => this.rollback(id));
  }
}

// State validation
export interface StateValidator<T> {
  (state: T): { valid: boolean; errors: string[] };
}

export class StateValidatorManager<T> {
  private validators: StateValidator<T>[] = [];

  addValidator(validator: StateValidator<T>): void {
    this.validators.push(validator);
  }

  validate(state: T): { valid: boolean; errors: string[] } {
    const allErrors: string[] = [];
    let valid = true;

    this.validators.forEach(validator => {
      const result = validator(state);
      if (!result.valid) {
        valid = false;
        allErrors.push(...result.errors);
      }
    });

    return { valid, errors: allErrors };
  }
}

// State debugging
export class StateDebugger {
  private static logs: Array<{ timestamp: Date; action: StateAction; state: any }> = [];
  private static isEnabled: boolean = process.env.NODE_ENV === 'development';

  static log<T>(action: StateAction, state: T): void {
    if (!this.isEnabled) return;

    this.logs.push({
      timestamp: new Date(),
      action,
      state: JSON.parse(JSON.stringify(state)) // Deep clone
    });

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

  }

  static getLogs(): Array<{ timestamp: Date; action: StateAction; state: any }> {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }

  static enable(): void {
    this.isEnabled = true;
  }

  static disable(): void {
    this.isEnabled = false;
  }
}

// State middleware
export const stateMiddleware = {
  // Logging middleware
  logging: <T>(action: StateAction, next: () => void) => {
    next();
  },

  // Persistence middleware
  persistence: <T>(key: string) => (action: StateAction, next: () => void) => {
    next();
    // Save state after action is applied
    setTimeout(() => {
      const state = (action as any).__store?.getState();
      if (state) {
        StatePersistence.save(key, state);
      }
    }, 0);
  },

  // Validation middleware
  validation: <T>(validator: StateValidator<T>) => (action: StateAction, next: () => void) => {
    next();
    // Validate state after action is applied
    setTimeout(() => {
      const state = (action as any).__store?.getState();
      if (state) {
        const result = validator(state);
        if (!result.valid) {
        }
      }
    }, 0);
  }
};

// Enhanced context provider factory
export function createEnhancedContext<T>(
  initialState: T,
  reducers: Record<string, StateReducer<T>>,
  options?: {
    persist?: boolean;
    persistKey?: string;
    validate?: StateValidator<T>;
    middleware?: Array<(action: StateAction, next: () => void) => void>;
  }
) {
  const store = new AdvancedStateStore(initialState);
  
  // Add reducers
  Object.entries(reducers).forEach(([type, reducer]) => {
    store.addReducer(type, reducer);
  });

  // Add middleware
  if (options?.middleware) {
    options.middleware.forEach(middleware => store.addMiddleware(middleware));
  }

  // Add persistence middleware
  if (options?.persist && options?.persistKey) {
    store.addMiddleware(stateMiddleware.persistence(options.persistKey));
  }

  // Add validation middleware
  if (options?.validate) {
    store.addMiddleware(stateMiddleware.validation(options.validate));
  }

  // Add logging middleware in development
  if (process.env.NODE_ENV === 'development') {
    store.addMiddleware(stateMiddleware.logging);
  }

  return store;
}
