import * as React from "react";

import { State, StateService } from "../common/state";

export interface Props {
  state: State;
  service: StateService;
}

export class Popup extends React.PureComponent<Props, {}> {
  render() {
    return (
      <div>

      </div>
    );
  }
}
