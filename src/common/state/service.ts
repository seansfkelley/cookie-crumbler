import { State, HostnameRule } from "./latest";
import { spread } from "../lang";

export class StateService {
  constructor(private transition: (updater: (state: State) => State) => void) {}

  public addRule(rule: HostnameRule) {
    this.transition(state => {
      return spread(state, {
        rules: [
          ...state.rules,
          rule,
        ],
      });
    });
  }
}
