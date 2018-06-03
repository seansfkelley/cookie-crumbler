import { spread } from "../lang";
import { State, HostnameRule, LogBatch, Settings } from "./latest";

export class StateService {
  constructor(private transition: (updater: (state: State) => State) => void) {}

  public setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    this.transition(state => spread(state, {
      settings: {
        ...state.settings,
        [key]: value,
      },
    }));
  }

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
        log,
        ...state.logs,
      ],
    }));
  }

  public resetLogs(logs: LogBatch[]) {
    this.transition(state => spread(state, {
      logs,
    }));
  }
}
