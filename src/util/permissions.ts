const instancePermissions = [
  {
    value: "create_prefetches",
    category: "Data Access"
  },
  {
    value: "embed_browse_spaces",
    category: "BI Interaction"
  },
  {
    value: "login_special_email",
    category: "Data Access"
  },
  {
    value: "manage_homepage",
    category: "BI Interaction"
  },
  {
    value: "manage_models",
    category: "Development Tools"
  },
  {
    value: "manage_spaces",
    category: "BI Interaction"
  },
  {
    value: "see_logs",
    category: "Admin"
  },
  {
    value: "see_queries",
    category: "Admin"
  },
  {
    value: "see_schedules",
    category: "Admin"
  },
  {
    value: "see_system_activity",
    category: "Admin"
  },
  {
    value: "see_users",
    category: "Admin"
  },
  {
    value: "sudo",
    category: "Admin"
  },
  {
    value: "support_access_toggle",
    category: "Admin"
  }
];

const allAccessibleModels = [
  {
    value: "see_pdts",
    category: "Admin"
  },
  {
    value: "see_datagroups",
    category: "Admin"
  },
  {
    value: "update_datagroups",
    category: "Admin"
  },
  {
    value: "create_alerts",
    category: "BI Interaction"
  },
  {
    value: "follow_alerts",
    category: "BI Interaction"
  },
  {
    value: "send_outgoing_webhook",
    category: "Data Access"
  },
  {
    value: "send_to_s3",
    category: "Data Access"
  },
  {
    value: "send_to_sftp",
    category: "Data Access"
  },
  {
    value: "send_to_integration",
    category: "Data Access"
  },
  {
    value: "create_table_calculations",
    category: "Data Access"
  },
  {
    value: "save_content",
    category: "BI Interaction"
  },
  {
    value: "schedule_external_look_emails",
    category: "Data Access"
  },
  {
    value: "deploy",
    category: "Development Tools"
  }
];

const modelPermissions = [
  {
    value: "access_data",
    category: "Data Access"
  },
  {
    value: "see_drill_overlay",
    category: "BI Interaction"
  },
  {
    value: "see_lookml_dashboards",
    category: "BI Interaction"
  },
  {
    value: "see_looks",
    category: "BI Interaction"
  },
  {
    value: "download_with_limit",
    category: "Data Access"
  },
  {
    value: "download_without_limit",
    category: "Data Access"
  },
  {
    value: "see_user_dashboards",
    category: "BI Interaction"
  },
  {
    value: "see_sql",
    category: "BI Interaction"
  },
  {
    value: "explore",
    category: "BI Interaction"
  },
  {
    value: "create_public_looks",
    category: "Data Access"
  },
  {
    value: "schedule_look_emails",
    category: "Data Access"
  },
  {
    value: "see_lookml",
    category: "Development Tools"
  },
  {
    value: "use_sql_runner",
    category: "Development Tools"
  },
  {
    value: "develop",
    category: "Development Tools"
  }
];

export const distinct = (value: any, index: any, self: any) => {
  return self.indexOf(value) === index;
};

export function getUniquePermissions(
  permissionList1: string[],
  permissionList2: Record<string, string>[]
) {
  let intersection = [];
  for (let x of permissionList1) {
    for (let y of permissionList2) {
      if (x === y.value) {
        intersection.push(y);
      }
    }
  }
  return intersection;
}

export function getModelPermissions(permissionList: string[]) {
  return getUniquePermissions(permissionList, modelPermissions);
}

export function getInstancePermissions(permissionList: string[]) {
  return getUniquePermissions(permissionList, instancePermissions);
}

export function getAllAccessibleModelPermissions(permissionList: string[]) {
  return getUniquePermissions(permissionList, allAccessibleModels);
}
