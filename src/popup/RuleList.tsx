import * as React from "react";
import { Checkbox } from "@blueprintjs/core";

import { DomainWhitelistRule } from "../common/state";

interface Props {
  rules: DomainWhitelistRule[];
  editRule: (oldRule: DomainWhitelistRule, newRule: DomainWhitelistRule) => void;
}

export class RuleList extends React.PureComponent<Props, {}> {
  render() {
    return (
      <table className="pt-html-table">
        <thead>
          <tr>
            <th>Domain</th>
            <th>Include Subdomains</th>
            <th>Clean on Restart</th>
            <th>Cookie Whitelist</th>
          </tr>
        </thead>
        <tbody>
          {this.props.rules.map(this.renderRule)}
        </tbody>
      </table>
    );
  }

  private renderRule = (rule: DomainWhitelistRule, key: number) => (
    <tr key={key}>
      <td>
        {rule.domain}
      </td>
      <td>
        <Checkbox
          checked={rule.whitelistSubdomains}
          onChange={() => {
            this.props.editRule(rule, {
              ...rule,
              whitelistSubdomains: !rule.whitelistSubdomains,
            });
          }}
        />
      </td>
      <td>
        <Checkbox
          checked={rule.cleanOnBrowserRestart}
          onChange={() => {
            this.props.editRule(rule, {
              ...rule,
              cleanOnBrowserRestart: !rule.cleanOnBrowserRestart,
            });
          }}
        />
      </td>
      <td>
        {rule.onlyWhitelistCookieNames}
      </td>
    </tr>
  )
}
