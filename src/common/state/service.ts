import { findIndex } from "lodash-es";

import { spread, isEqualT, replaceIndex } from "../lang";
import { State, DomainWhitelistRule, LogBatch, Settings } from "./latest";

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

  public addRule(rule: DomainWhitelistRule) {
    this.transition(state => spread(state, {
      rules: [
        ...state.rules,
        rule,
      ],
    }));
  }

  public editRule(oldRule: DomainWhitelistRule, newRule: DomainWhitelistRule) {
    this.transition(state => {
      const index = findIndex(state.rules, r => isEqualT(r, oldRule));
      if (index === -1) {
        throw new Error("could not file rule to replace");
      }
      return spread(state, {
        rules: replaceIndex(state.rules, index, newRule),
      })
    });
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
