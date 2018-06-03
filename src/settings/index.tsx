import '../common/init';

import * as React from "react";
import * as ReactDOM from "react-dom";

import { getStorageEngine, StateService } from "../common/state";
import { Settings } from "./Settings";

const ELEMENT = document.getElementById("body")!;

async function initialize() {
  const engine = await getStorageEngine();
  const service = new StateService(engine.transitionState);

  engine.addChangeListener(state => {
    ReactDOM.render(
      <Settings
        state={state}
        service={service}
      />,
      ELEMENT,
    );
  });
}

initialize();
