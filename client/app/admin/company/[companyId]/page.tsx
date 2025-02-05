import React from "react";

import { getQueryClient } from "@/lib/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Hydrate } from "@/lib/hydrate";
import EditCompanyForm from "@/components/admin/company/editCompany";




const EditCompanyPage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <EditCompanyForm />
    </Hydrate>
  );
};

export default EditCompanyPage;
