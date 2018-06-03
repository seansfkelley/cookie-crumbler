import * as React from "react";

import { PropertyNamesOfType } from "../common/lang";
import { State, StateService, Settings as SettingsObject } from "../common/state";
import { SettingsListCheckbox } from "./SettingsListCheckbox";

export interface Props {
  state: State;
  service: StateService;
}

export class Settings extends React.PureComponent<Props, {}> {
  render() {
    return (
      <div className="settings-form">
        <header>
          <h3>Automatic Deletion</h3>
          <p>Automatically delete cookies and (if enabled) Local Storage as you browse away from sites.</p>
        </header>
        <ul className="settings-list">
          {this.renderToggleableSetting(
            "enableAutomaticDeletion",
            browser.i18n.getMessage("Delete_local_data_automatically"),
          )}
          {this.renderToggleableSetting(
            "enableInTabDeletion",
            browser.i18n.getMessage("Delete_data_when_changing_tabs"),
            this.props.state.settings.enableAutomaticDeletion,
          )}
        </ul>
        <header>
          <h3>Local Storage</h3>
          <p>Local Storage can be used for "supercookies" or other tracking data.</p>
          <p>Please note that browser support for controlling Local Storage through extensions is minimal. TODO: Explain more.</p>
        </header>
        <ul className="settings-list">
          {this.renderToggleableSetting(
            "enableLocalStorageDeletion",
            browser.i18n.getMessage("Delete_LocalStorage_data"),
          )}
        </ul>
        <header>
          <h3>Logging and Notifications</h3>
        </header>
        <ul className="settings-list">
          {this.renderToggleableSetting(
            "enableLogging",
            browser.i18n.getMessage("Log_deleted_local_data"),
          )}
          {this.renderToggleableSetting(
            "enableNotifications",
            browser.i18n.getMessage("Show_deletion_notifications"),
          )}
        </ul>
      </div>
    );
  }

  private renderToggleableSetting<K extends PropertyNamesOfType<SettingsObject, boolean>>(key: K, label: string, enabled: boolean = true) {
    return (
      <SettingsListCheckbox
        enabled={enabled}
        checked={this.props.state.settings[key]}
        onChange={() => {
          this.props.service.setSetting(key, !this.props.state.settings[key]);
        }}
        label={label}
      />
    );
  }
}
