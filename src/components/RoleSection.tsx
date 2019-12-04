import React from "react";
import { IPermission, IModelSet, IRole } from "@looker/sdk";
import { Flex, Box, Heading, Text, Paragraph } from "@looker/components";
import { ExtensionContext } from "../framework/ExtensionWrapper";
import {
  getModelPermissions,
  getInstancePermissions
} from "../util/permissions";

interface RoleSectionProps {
  roles?: IRole[];
}

interface ModelSetDataItem {
  models: string[];
  modelPermissions: string[];
}

interface RoleSectionState {
  instancePermissions: Record<string, string>[];
  modelSetData: Record<string, ModelSetDataItem>[];
  modelSets: IModelSet[];
}

class RoleSection extends React.Component<RoleSectionProps, RoleSectionState> {
  constructor(props: RoleSectionProps) {
    super(props);
    this.state = {
      instancePermissions: [],
      modelSetData: [],
      modelSets: []
    };
  }

  componentDidMount() {
    const instancePermissions = this.getInstancePermissions();
    this.setState({
      instancePermissions: instancePermissions
    });
  }

  getInstancePermissions() {
    const { roles } = this.props;
    let instancePermissions: Record<string, string>[] = [];
    roles &&
      roles.forEach(role => {
        if (role.permission_set) {
          let permissions = role.permission_set.permissions;
          permissions &&
            instancePermissions.concat(getInstancePermissions(permissions));
        }
      });
    return instancePermissions;
  }

  render() {
    const { roles } = this.props;
    return (
      <Flex flexDirection="column" mr="xxxlarge">
        {roles ? (
          <>
            <Paragraph mb="large" fontSize="medium" color="palette.charcoal600">
              Roles
            </Paragraph>
            <Flex flexDirection="column">
              {roles.map(role => (
                <Paragraph key={role.id} fontSize="small">
                  {role.name}
                </Paragraph>
              ))}
            </Flex>
          </>
        ) : (
          ""
        )}
      </Flex>
    );
  }
}

export default RoleSection;
