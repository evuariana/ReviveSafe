// src/pages/create.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Settings,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReviveFactory } from "@/hooks/useReviveFactory";
import { isValidAddress } from "@/lib/utils";
import { Address } from "viem";

const steps = [
  {
    id: 1,
    name: "Add Owners",
    icon: Users,
    description: "Specify wallet addresses that will control the multisig",
  },
  {
    id: 2,
    name: "Set Threshold",
    icon: Shield,
    description: "Choose how many signatures are required",
  },
  {
    id: 3,
    name: "Review & Deploy",
    icon: Settings,
    description: "Confirm details and deploy your multisig",
  },
];

export default function Create() {
  const navigate = useNavigate();
  const { address: userAddress } = useAccount();
  const { createMultisig, isCreating, createSuccess } = useReviveFactory();

  const [currentStep, setCurrentStep] = useState(1);
  const [owners, setOwners] = useState<string[]>([userAddress || ""]);
  const [newOwner, setNewOwner] = useState("");
  const [required, setRequired] = useState(1);
  const [error, setError] = useState("");

  const addOwner = () => {
    if (!newOwner.trim()) {
      setError("Please enter an address");
      return;
    }

    if (!isValidAddress(newOwner)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    if (owners.includes(newOwner.toLowerCase())) {
      setError("This address is already added");
      return;
    }

    setOwners([...owners, newOwner.toLowerCase()]);
    setNewOwner("");
    setError("");
  };

  const removeOwner = (index: number) => {
    if (owners.length > 1) {
      const newOwners = owners.filter((_, i) => i !== index);
      setOwners(newOwners);
      if (required > newOwners.length) {
        setRequired(newOwners.length);
      }
    }
  };

  const canProceedToStep2 =
    owners.length >= 1 && owners.every((addr) => isValidAddress(addr));
  const canProceedToStep3 = required >= 1 && required <= owners.length;

  const handleDeploy = async () => {
    try {
      if (!canProceedToStep3) return;

      await createMultisig(owners as Address[], required);

      if (createSuccess) {
        navigate("/wallets");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create multisig"
      );
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">Add Wallet Owners</h3>
        <p className="text-gray-600">
          Add the wallet addresses that will be owners of this multisig. Each
          owner can propose and approve transactions.
        </p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="new-owner">Owner Addresses</Label>

        {/* Current owners list */}
        <div className="space-y-2">
          {owners.map((owner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 font-mono text-sm">
                {owner}
                {owner.toLowerCase() === userAddress?.toLowerCase() && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    You
                  </span>
                )}
              </div>
              {owners.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOwner(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add new owner */}
        <div className="flex gap-2">
          <Input
            id="new-owner"
            placeholder="0x..."
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            className="font-mono"
            onKeyPress={(e) => e.key === "Enter" && addOwner()}
          />
          <Button onClick={addOwner} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2}>
          Next: Set Threshold
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">Set Signature Threshold</h3>
        <p className="text-gray-600">
          Choose how many owner signatures are required to execute a
          transaction. This affects the security and convenience of your
          multisig.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="required">Required Signatures</Label>
          <div className="mt-2">
            <Input
              id="required"
              type="number"
              min={1}
              max={owners.length}
              value={required}
              onChange={(e) => setRequired(parseInt(e.target.value) || 1)}
              className="w-24"
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            out of {owners.length} total owners
          </p>
        </div>

        {/* Threshold recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              required === 1
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setRequired(1)}
          >
            <div className="font-medium">1 of {owners.length}</div>
            <div className="text-sm text-gray-600">
              Most convenient, least secure
            </div>
          </div>

          {owners.length >= 2 && (
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                required === Math.ceil(owners.length / 2)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setRequired(Math.ceil(owners.length / 2))}
            >
              <div className="font-medium">
                {Math.ceil(owners.length / 2)} of {owners.length}
              </div>
              <div className="text-sm text-gray-600">
                Balanced security and convenience
              </div>
            </div>
          )}

          {owners.length >= 3 && (
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                required === owners.length
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setRequired(owners.length)}
            >
              <div className="font-medium">
                {owners.length} of {owners.length}
              </div>
              <div className="text-sm text-gray-600">
                Most secure, requires all owners
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={() => setCurrentStep(3)} disabled={!canProceedToStep3}>
          Next: Review
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">Review & Deploy</h3>
        <p className="text-gray-600">
          Review your multisig configuration before deploying to the blockchain.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Multisig Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Owners ({owners.length})</h4>
            <div className="space-y-1">
              {owners.map((owner, index) => (
                <div
                  key={index}
                  className="text-sm font-mono bg-gray-50 p-2 rounded"
                >
                  {owner}
                  {owner.toLowerCase() === userAddress?.toLowerCase() && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Signature Threshold</h4>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>
                {required} of {owners.length} signatures required
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {createSuccess && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle2 className="h-4 w-4" />
          Multisig created successfully! Redirecting...
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleDeploy} disabled={isCreating || createSuccess}>
          {isCreating ? "Deploying..." : "Deploy Multisig"}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Multisig Wallet
        </h1>
        <p className="text-gray-600">
          Set up a new multisignature wallet for collaborative asset management
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ml-8 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </CardContent>
      </Card>
    </motion.div>
  );
}
