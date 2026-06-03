export const dynamic = 'force-dynamic';
import AccountPage from "@/src/compronent/account/accountPage"

import { Suspense } from "react";

const account=()=> {
  return (
    <>
        <Suspense fallback={null}>
            <AccountPage/>
        </Suspense>
    </>
  )
}

export default account
