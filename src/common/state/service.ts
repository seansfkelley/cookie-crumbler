import { spread } from "../lang";
import { State, HostnameRule, LogBatch } from "./latest";

export class StateService {
  constructor(private transition: (updater: (state: State) => State) => void) {}

  public addRule(rule: HostnameRule) {
    this.transition(state => spread(state, {
      rules: [
        ...state.rules,
        rule,
      ],
    }));
  }

  public addLogBatch(log: LogBatch) {
    this.transition(state => spread(state, {
      logs: [
        ...state.logs,
        log,
      ],
    }));
  }
}
