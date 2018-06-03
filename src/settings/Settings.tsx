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
        {/* <header>
          <h3>{browser.i18n.getMessage('Connection')}</h3>
          <p>{browser.i18n.getMessage('Please_note_that_QuickConnect_IDs_are_not_currently_supported')}</p>
        </header> */}
        <ul className="settings-list">
          {this.renderToggleableSetting(
            "enableAutomaticDeletion",
            browser.i18n.getMessage("Delete_local_data_automatically"),
          )}
          {this.renderToggleableSetting(
            "enableInTabDeletion",
            browser.i18n.getMessage("Delete_data_when_changing_tabs"),
          )}
          {this.renderToggleableSetting(
            "enableLocalStorageDeletion",
            browser.i18n.getMessage("Delete_LocalStorage_data"),
          )}
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

  private renderToggleableSetting<K extends PropertyNamesOfType<SettingsObject, boolean>>(key: K, label: string) {
    return (
      <SettingsListCheckbox
        checked={this.props.state.settings[key]}
        onChange={() => {
          this.props.service.setSetting(key, !this.props.state.settings[key]);
        }}
        label={label}
      />
    );
  }
}
