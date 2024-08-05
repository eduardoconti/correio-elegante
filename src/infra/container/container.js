class Container {
  constructor() {
    this.services = new Map();
  }

  register(name, definition, dependencies) {
    this.services.set(name, { definition, dependencies: dependencies ?? [] });
  }

  get(name) {
    const service = this.services.get(name);

    if (!service) {
      throw new Error(`Service ${name} not found`);
    }

    if (!service.instance) {
      const dependencies = service.dependencies.map((dep) => this.get(dep));
      service.instance = service.definition(...dependencies);
    }

    return service.instance;
  }
}

const container = new Container();

module.exports = { Container, container };
