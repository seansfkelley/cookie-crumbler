import { sortBy } from "lodash-es";

import { State, StateService } from "../common/state";

const LOG_LENGTH_LIMIT = 100;

export class LogGarbageCollector {
  constructor(private state: State, private service: StateService) {}

  public updateState = (state: State) => {
    if (this.state.settings.enableLogging && !state.settings.enableLogging) {
      this.service.resetLogs([]);
    }

    this.state = state;

    if (this.state.logs.length > LOG_LENGTH_LIMIT) {
      this.collectGarbage();
    }
  }

  public collectGarbage() {
    // There's all kinds of time zone issues and such with this, but we don't really care; we're just looking
    // for a ~1h period as far as the local machine is concerned. If it ends up 0h or 2h, whatever.
    const cutoffTimestamp = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const culledLogs = sortBy(this.state.logs, l => l.timestamp)
      .reverse()
      .filter(l => l.timestamp > cutoffTimestamp)
      .slice(0, LOG_LENGTH_LIMIT);
    this.service.resetLogs(culledLogs);
  }
}
