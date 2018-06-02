import { State, HostnameRule } from "./latest";
import { spread } from "../lang";

export interface StorageEngine {
  transition: (updater: (state: State) => State) => void;
}

export class StateService {
  static get = (engine: StorageEngine) => new StateService(engine);

  private constructor(private engine: StorageEngine) {}

  public addRule(rule: HostnameRule) {
    this.engine.transition(state => {
      return spread(state, {
        rules: [
          ...state.rules,
          rule,
        ],
      });
    });
  }
}
