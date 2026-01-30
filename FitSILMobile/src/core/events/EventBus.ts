// src/core/events/EventBus.ts
type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    console.log(`📡 Listener registrado para: ${event}`);
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
    console.log(`📡 Listener removido para: ${event}`);
  }

  emit(event: string, ...args: any[]) {
    console.log(`📢 Emitiendo evento: ${event}`);
    if (!this.events[event]) {
      console.log(`⚠️ No hay listeners para: ${event}`);
      return;
    }
    this.events[event].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`❌ Error en listener de ${event}:`, error);
      }
    });
  }
}

export const eventBus = new EventBus();