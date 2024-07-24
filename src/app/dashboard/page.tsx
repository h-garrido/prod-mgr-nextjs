"use client"

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/firebase";

const Dashboard = () => {
    return ( 
        <div>

            <Button onClick={() => signOut()}>Cerrar Sesión</Button>
        </div>
     );
}
 
export default Dashboard;