import AccountPage from "@/src/compronent/account/accountPage"
import { Suspense } from "react";

const account=()=> {
  return (
    <div>
        <Suspense fallback={null}>
            <AccountPage/>
        </Suspense>
    </div>
  )
}

export default account