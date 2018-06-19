import * as React from "react";
import { Button, Intent, ButtonGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { State, StateService } from "../common/state";
import { deleteCookiesAndNotify } from "../common/actions";

export interface Props {
  state: State;
  service: StateService;
}

export class Popup extends React.PureComponent<Props, {}> {
  render() {
    const { enableAutomaticDeletion } = this.props.state.settings;
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <h5>Cookie Crumbler</h5>
        <ButtonGroup>
          <Button
            icon={IconNames.POWER}
            intent={enableAutomaticDeletion ? Intent.SUCCESS : Intent.DANGER}
            onClick={() => { this.props.service.setSetting("enableAutomaticDeletion", !enableAutomaticDeletion); }}
          >
            Automatic Deletion
          </Button>
          <Button
            icon={IconNames.ERASER}
            intent={Intent.WARNING}
            onClick={() => { deleteCookiesAndNotify(this.props.state, this.props.service); }}
          >
            Delete Cookies
          </Button>
          <Button
            icon={IconNames.COG}
            onClick={() => { browser.runtime.openOptionsPage(); }}
          />
        </ButtonGroup>
      </div>
    );
  }
}
