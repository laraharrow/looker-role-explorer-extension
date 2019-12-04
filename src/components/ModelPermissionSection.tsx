import React from "react";
import { IPermission, IModelSet, IRole } from "@looker/sdk";
import {
  Flex,
  Box,
  Heading,
  Text,
  Paragraph,
  List,
  ListItem
} from "@looker/components";
import Select from "react-select";
import { ExtensionContext } from "../framework/ExtensionWrapper";
import {
  getModelPermissions,
  getAllAccessibleModelPermissions,
  getUniquePermissions,
  distinct
} from "../util/permissions";

interface ModelPermissionProps {
  roles?: IRole[];
}

interface ModelPermissionState {
  accessibleModelPerms: Record<string, string>[];
  modelData: Map<string, string[]>;
  selectedModel: Record<string, string> | null;
  modelsArray: string[];
}

class ModelPermissionSection extends React.Component<
  ModelPermissionProps,
  ModelPermissionState
> {
  constructor(props: ModelPermissionProps) {
    super(props);
    this.state = {
      accessibleModelPerms: [],
      modelData: new Map(),
      modelsArray: [],
      selectedModel: null
    };
  }

  componentDidMount() {
    const accessibleModelPerms = this.getAllAccessibleModelPermissions();
    const modelPermissions = this.getModelSpecificPermissions();
    const modelArray = this.getModelArray(modelPermissions);
    this.setState({
      accessibleModelPerms: accessibleModelPerms,
      modelData: modelPermissions,
      modelsArray: modelArray
    });
  }

  componentDidUpdate(
    prevProps: ModelPermissionProps,
    prevState: ModelPermissionState
  ) {
    if (prevProps.roles !== this.props.roles) {
      const accessibleModelPerms = this.getAllAccessibleModelPermissions();
      const modelPermissions = this.getModelSpecificPermissions();
      const modelArray = this.getModelArray(modelPermissions);
      this.setState({
        accessibleModelPerms: accessibleModelPerms,
        modelData: modelPermissions,
        modelsArray: modelArray
      });
    }
  }

  getAllAccessibleModelPermissions() {
    const { roles } = this.props;
    const { accessibleModelPerms } = this.state;
    let newPermissions = accessibleModelPerms;
    if (roles) {
      for (let role of roles) {
        let perms = this.getAccessibleModelPermissionsForRole(role);
        newPermissions = perms.concat(newPermissions).filter(distinct);
      }
    }
    return newPermissions;
  }

  getAccessibleModelPermissionsForRole(role: IRole) {
    let permissions: Record<string, string>[] = [];
    if (role.permission_set && role.permission_set.permissions) {
      permissions = getAllAccessibleModelPermissions(
        role.permission_set.permissions
      );
    }
    return permissions;
  }

  getModelSpecificPermissions() {
    const { roles } = this.props;
    let map = new Map();
    for (let role of roles!) {
      let modelSet = role.model_set;
      let permissionSet = role.permission_set;
      let models = modelSet && modelSet.models;
      let permissions = permissionSet && permissionSet.permissions;
      let modelPermissions = permissions && getModelPermissions(permissions);
      if (models) {
        for (let model of models) {
          if (map.has(model)) {
            let perms = map.get(model);
            const uniqPerms =
              modelPermissions &&
              perms.concat(modelPermissions).filter(distinct);
            map.set(model, uniqPerms);
          } else {
            map.set(model, modelPermissions);
          }
        }
      }
    }
    return map;
  }

  renderModelItem(model: string) {
    return (
      <ListItem key={model}>
        <Paragraph fontSize="small">{model}</Paragraph>
      </ListItem>
    );
  }

  getModelArray(modelData: Map<string, string[]>) {
    const models = modelData.keys();
    let modelArray = [];
    let x = models.next().value;
    while (x) {
      modelArray.push(x);
      x = models.next().value;
    }
    return modelArray;
  }

  renderModelsList() {
    const { modelsArray } = this.state;
    return (
      <List overflowY="scroll">
        {modelsArray.map(model => this.renderModelItem(model))}
      </List>
    );
  }

  handleDropDownChange(selectedOption: any) {
    this.setState({
      selectedModel: selectedOption
    });
  }

  createModelOptions() {
    const { modelsArray } = this.state;
    let options = new Array(modelsArray.length);
    for (let i in modelsArray) {
      options[i] = { value: modelsArray[i], label: modelsArray[i] };
    }
    return options;
  }

  modelDropDownStyles() {
    return {
      option: (provided: any, state: any) => ({
        ...provided,
        borderBottom: "1px dotted pink",
        fontSize: "12px",
        display: "flex",
        flex: "0 1 auto"
      })
    };
  }

  modelDropDown() {
    const { selectedModel } = this.state;
    const modelOptions = this.createModelOptions();
    return (
      <Select
        styles={this.modelDropDownStyles()}
        value={selectedModel}
        onChange={(selectedModel: any) =>
          this.handleDropDownChange(selectedModel)
        }
        options={modelOptions}
        placeholder="Model Name"
      />
    );
  }

  eachCategories = (list: any) =>
    list.map((permission: any, index: any) => (
      <Paragraph key={index} fontSize="small">
        {permission}
      </Paragraph>
    ));

  instancePermissionsList = (instancePermissions: any) => {
    const finalList: any = {};
    instancePermissions.map((permission: Record<string, string>) => {
      if (finalList[permission.category]) {
        finalList[permission.category].push(permission.value);
      } else {
        finalList[permission.category] = [permission.value];
      }
    });
    let arr = [];

    for (const category in finalList) {
      arr.push(
        <div key={category}>
          <Paragraph fontWeight="bold" fontSize="medium">
            {category}
          </Paragraph>
          {this.eachCategories(finalList[category])}
        </div>
      );
    }
    return arr;
  };

  renderModelPermissions() {
    const { selectedModel } = this.state;
    const modelPermissions =
      selectedModel && this.state.modelData.get(selectedModel.value);
    return modelPermissions
      ? this.instancePermissionsList(modelPermissions)
      : "";
  }

  render() {
    return (
      <Flex flexDirection="column">
        <Paragraph fontSize="medium" mb="large" color="palette.charcoal600">
          Model Permissions
        </Paragraph>
        <Box mb="large">{this.modelDropDown()}</Box>
        <Box>{this.renderModelPermissions()}</Box>
      </Flex>
    );
  }
}

export default ModelPermissionSection;
