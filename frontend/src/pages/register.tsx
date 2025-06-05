import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function RegisterMultisig() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Register Existing Multisig
        </h1>
        <p className="text-gray-600 mt-2">
          Add a previously deployed multisig to your dashboard
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Register Multisig
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            The registration feature is coming in Phase 2. You'll be able to
            register existing multisig contracts to manage them through
            ReviveSafe.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
