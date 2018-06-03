import '../common/init';

import { getStorageEngine, StateService } from "../common/state";
import { TabEventHandler } from "./TabEventHandler";
import { LogGarbageCollector } from "./LogGarbageCollector";

const GC_LOGS_ALARM_NAME = "GC_LOGS_ALARM";

async function initialize() {
  const engine = await getStorageEngine();
  const service = new StateService(engine.transitionState);

  let tabEventHandler: TabEventHandler | undefined;
  let logGarbageCollector: LogGarbageCollector | undefined;

  engine.addChangeListener(state => {
    if (!tabEventHandler) {
      tabEventHandler = new TabEventHandler(state, service);
      browser.tabs.onUpdated.addListener(tabEventHandler.onUpdatedListener);
      browser.tabs.onRemoved.addListener(tabEventHandler.onRemovedListener);
    } else {
      tabEventHandler.updateState(state);
    }

    if (!logGarbageCollector) {
      logGarbageCollector = new LogGarbageCollector(state, service);
      browser.alarms.create(GC_LOGS_ALARM_NAME, {
        periodInMinutes: 5,
      });
      browser.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === GC_LOGS_ALARM_NAME) {
          logGarbageCollector!.collectGarbage();
        }
      })
    } else {
      logGarbageCollector.updateState(state);
    }
  });
}

initialize();
