import * as React from "react";
import { uniqueId } from "lodash-es";

export interface Props {
  enabled: boolean;
  checked: boolean;
  onChange: () => void;
  label: string;
}

export class SettingsListCheckbox extends React.PureComponent<Props, {}> {
  render() {
    const id = uniqueId("checkbox-id-");
    return (
      <li>
        <input
          id={id}
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onChange}
          disabled={!this.props.enabled}
        />
        <label htmlFor={id}>{this.props.label}</label>
      </li>
    );
  }
}
