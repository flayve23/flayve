import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface KYCModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function KYCModal({ open, onOpenChange, onSuccess }: KYCModalProps) {
  const toast = (props: any) => {
    console.log("Toast:", props);
    alert(props.description || props.title);
  };
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    dateOfBirth: "",
    nationality: "Brasileira",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bankName: "",
    bankCode: "",
    accountType: "checking" as "checking" | "savings",
    accountNumber: "",
    accountDigit: "",
    branchCode: "",
    accountHolder: "",
    idDocumentType: "rg" as "rg" | "cnh" | "passport",
    idDocumentNumber: "",
    idDocumentUrl: "",
    proofOfAddressUrl: "",
  });

  const submitMutation = trpc.kyc.submit.useMutation();
  const getMyKYC = trpc.kyc.getMyKYC.useQuery();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (field: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "Arquivo não pode ser maior que 5MB",
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Upload falhou");

      const data = await response.json();
      setUploadedFiles((prev) => ({
        ...prev,
        [field]: data.url,
      }));
      setFormData((prev) => ({
        ...prev,
        [field]: data.url,
      }));

      toast({
        title: "Sucesso",
        description: "Arquivo enviado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do arquivo",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitMutation.mutateAsync({
        ...formData,
        idDocumentUrl: uploadedFiles.idDocumentUrl || formData.idDocumentUrl,
        proofOfAddressUrl: uploadedFiles.proofOfAddressUrl || formData.proofOfAddressUrl,
      });

      toast({
        title: "Sucesso",
        description: "KYC submetido para análise. Você receberá uma resposta em até 24 horas.",
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao submeter KYC",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (getMyKYC.data?.status === "approved") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              KYC Aprovado
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Sua verificação de identidade foi aprovada! Você agora pode fazer saques.
            </p>
            <p className="text-xs text-gray-500">
              Válido até: {getMyKYC.data?.expiresAt ? new Date(getMyKYC.data.expiresAt).toLocaleDateString("pt-BR") : "N/A"}
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (getMyKYC.data?.status === "pending") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              KYC em Análise
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Sua verificação de identidade está sendo analisada. Você receberá uma resposta em até 24 horas.
            </p>
            <p className="text-xs text-gray-500">
              Submetido em: {getMyKYC.data?.submittedAt ? new Date(getMyKYC.data.submittedAt).toLocaleDateString("pt-BR") : "N/A"}
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (getMyKYC.data?.status === "rejected") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              KYC Rejeitado
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Sua verificação de identidade foi rejeitada.
            </p>
            <p className="text-sm bg-red-50 p-3 rounded text-red-700">
              {getMyKYC.data?.rejectionReason}
            </p>
            <p className="text-xs text-gray-500">
              Você pode tentar novamente com documentos diferentes.
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verificação de Identidade (KYC)</DialogTitle>
          <DialogDescription>
            Passo {step} de 4 - {step === 1 ? "Dados Pessoais" : step === 2 ? "Endereço" : step === 3 ? "Dados Bancários" : "Documentos"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Passo 1: Dados Pessoais */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="João da Silva"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nationality">Nacionalidade</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Passo 2: Endereço */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Rua das Flores, 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado (UF)</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value.toUpperCase())}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value.replace(/\D/g, ""))}
                  placeholder="01310100"
                />
              </div>
            </div>
          )}

          {/* Passo 3: Dados Bancários */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Nome do Banco</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                    placeholder="Banco do Brasil"
                  />
                </div>
                <div>
                  <Label htmlFor="bankCode">Código do Banco</Label>
                  <Input
                    id="bankCode"
                    value={formData.bankCode}
                    onChange={(e) => handleInputChange("bankCode", e.target.value)}
                    placeholder="001"
                    maxLength={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accountType">Tipo de Conta</Label>
                <Select value={formData.accountType} onValueChange={(value) => handleInputChange("accountType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Conta Corrente</SelectItem>
                    <SelectItem value="savings">Conta Poupança</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="branchCode">Agência</Label>
                  <Input
                    id="branchCode"
                    value={formData.branchCode}
                    onChange={(e) => handleInputChange("branchCode", e.target.value)}
                    placeholder="0001"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Conta</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    placeholder="123456"
                  />
                </div>
                <div>
                  <Label htmlFor="accountDigit">Dígito</Label>
                  <Input
                    id="accountDigit"
                    value={formData.accountDigit}
                    onChange={(e) => handleInputChange("accountDigit", e.target.value)}
                    placeholder="7"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accountHolder">Titular da Conta</Label>
                <Input
                  id="accountHolder"
                  value={formData.accountHolder}
                  onChange={(e) => handleInputChange("accountHolder", e.target.value)}
                  placeholder="João da Silva"
                />
              </div>
            </div>
          )}

          {/* Passo 4: Documentos */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="idDocumentType">Tipo de Documento</Label>
                <Select value={formData.idDocumentType} onValueChange={(value) => handleInputChange("idDocumentType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rg">RG</SelectItem>
                    <SelectItem value="cnh">CNH</SelectItem>
                    <SelectItem value="passport">Passaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="idDocumentNumber">Número do Documento</Label>
                <Input
                  id="idDocumentNumber"
                  value={formData.idDocumentNumber}
                  onChange={(e) => handleInputChange("idDocumentNumber", e.target.value)}
                  placeholder="123456789"
                />
              </div>

              <div>
                <Label>Foto do Documento (Frente)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload("idDocumentUrl", e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="idDocumentInput"
                  />
                  <label htmlFor="idDocumentInput" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Clique para fazer upload</p>
                    {uploadedFiles.idDocumentUrl && (
                      <p className="text-xs text-green-600 mt-2">✓ Arquivo enviado</p>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <Label>Comprovante de Endereço (Conta de Luz/Água)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload("proofOfAddressUrl", e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="proofOfAddressInput"
                  />
                  <label htmlFor="proofOfAddressInput" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Clique para fazer upload</p>
                    {uploadedFiles.proofOfAddressUrl && (
                      <p className="text-xs text-green-600 mt-2">✓ Arquivo enviado</p>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || loading}
          >
            Anterior
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={loading}
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !uploadedFiles.idDocumentUrl || !uploadedFiles.proofOfAddressUrl}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Enviando..." : "Enviar KYC"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
