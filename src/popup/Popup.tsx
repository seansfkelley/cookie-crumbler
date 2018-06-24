import * as React from "react";
import { Button, Intent, ButtonGroup, NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { State, StateService } from "../common/state";
import { deleteCookiesAndNotify } from "../common/actions";
import { matchingRules } from "../common/deletion";
import { getHostname, getRootDomain } from '../common/util';
import { RuleList } from './RuleList';

interface Props {
  state: State;
  service: StateService;
  currentTab: chrome.tabs.Tab | undefined;
}

export class Popup extends React.PureComponent<Props, {}> {
  render() {
    return (
      <>
        {this.renderHeader()}
        {this.renderRules()}
      </>
    );
  }

  private renderHeader() {
    const { enableAutomaticDeletion } = this.props.state.settings;
    return (
      <div className="d-flex align-items-center justify-content-between mt-2 mx-3 mb-3">
        <h5 className="mb-0">
          Cookie Crumbler
        </h5>
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
          >
            Settings
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  private renderRules() {
    if (this.props.currentTab == null) {
      return (
        <NonIdealState
          className="mb-2"
          visual={IconNames.REFRESH}
        />
      );
    } else {
      const hostname = getHostname(this.props.currentTab.url!);
      const rootDomain = getRootDomain(hostname);
      if (hostname != null && rootDomain != null) {
        const matchedRules = matchingRules(hostname, this.props.state.rules);
        if (matchedRules.length === 0) {
          return (
            <NonIdealState
              title="No Matching Rules"
              description="No existing rules match this domain."
              action={
                <Button
                  icon={IconNames.ADD}
                  intent={Intent.PRIMARY}
                  onClick={() => {
                    this.props.service.addRule({
                      domain: rootDomain,
                      whitelistSubdomains: true,
                      cleanOnBrowserRestart: true,
                    });
                  }}
                >
                  Add Default Rule
                </Button>}
            />
          );
        } else {
          return (
            <RuleList
              rules={matchedRules}
              editRule={this.props.service.editRule}
            />
          );
        }
      } else {
        return (
          <NonIdealState
            className="mb-3"
            title="No Domain"
            description="The current tab doesn't have any host domain."
          />
        );
      }
    }
  }
}
