'use client';

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, User, Mail, Phone, MapPin, Calendar, Lock, Eye, EyeOff, Save, Edit, X, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

interface ProfileData {
  name: string;
  cpf: string;
  data_nascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  password?: string;
  password_confirmation?: string;
}

export default function ProfilePage() {
  const { user, isLoading, fetchUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    cpf: '',
    data_nascimento: '',
    email: '',
    telefone: '',
    endereco: '',
    password: '',
    password_confirmation: ''
  });

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        cpf: user.cpf || '',
        data_nascimento: user.data_nascimento || '',
        email: user.email || '',
        telefone: user.telefone || '',
        endereco: user.endereco || '',
        password: '',
        password_confirmation: ''
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    }
    return value;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Preparar dados para envio (apenas campos alterados)
      const originalData = {
        name: user?.name || '',
        cpf: user?.cpf || '',
        data_nascimento: user?.data_nascimento || '',
        email: user?.email || '',
        telefone: user?.telefone || '',
        endereco: user?.endereco || ''
      };

      const changes: Partial<ProfileData> = {};
      
      // Verificar quais campos foram alterados
      Object.keys(formData).forEach(key => {
        const field = key as keyof ProfileData;
        if (field !== 'password' && field !== 'password_confirmation') {
          if (formData[field] !== originalData[field]) {
            // Remover máscaras do CPF e telefone antes de enviar
            if (field === 'cpf') {
              changes[field] = formData[field].replace(/\D/g, '');
            } else if (field === 'telefone') {
              changes[field] = formData[field].replace(/\D/g, '');
            } else {
              changes[field] = formData[field];
            }
          }
        }
      });

      // Se há senha, validar e incluir
      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          setErrorMessage('As senhas não coincidem.');
          return;
        }
        if (formData.password.length < 6) {
          setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
          return;
        }
        changes.password = formData.password;
        changes.password_confirmation = formData.password_confirmation;
      }

      // Se não há mudanças, não enviar
      if (Object.keys(changes).length === 0) {
        setErrorMessage('Nenhuma alteração foi feita.');
        return;
      }

      console.log('Dados para atualização:', changes);

      const response = await api.put('/profile', changes);
      
      if (response.data.error === false) {
        setSuccessMessage('Perfil atualizado com sucesso!');
        setIsEditing(false);
        
        // Atualizar dados do usuário
        await fetchUserData();
        
        // Limpar senhas
        setFormData(prev => ({
          ...prev,
          password: '',
          password_confirmation: ''
        }));
      } else {
        setErrorMessage('Erro ao atualizar perfil. Tente novamente.');
      }
    } catch (error: unknown) {
      console.error('Erro ao atualizar perfil:', error);
      
      let errorMsg = 'Erro de conexão. Tente novamente.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: { 
              message?: string;
              error?: string;
              errors?: Record<string, string[]>;
            };
            status?: number;
          } 
        };
        
        if (axiosError.response?.data?.message) {
          errorMsg = axiosError.response.data.message;
        } else if (axiosError.response?.data?.error) {
          errorMsg = axiosError.response.data.error;
        } else if (axiosError.response?.data?.errors) {
          const errors = axiosError.response.data.errors;
          const firstError = Object.values(errors)[0];
          errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
        }
        
        if (axiosError.response?.status === 422) {
          errorMsg = 'Dados inválidos. Verifique os campos.';
        } else if (axiosError.response?.status === 409) {
          errorMsg = 'Email já está em uso.';
        }
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        cpf: user.cpf || '',
        data_nascimento: user.data_nascimento || '',
        email: user.email || '',
        telefone: user.telefone || '',
        endereco: user.endereco || '',
        password: '',
        password_confirmation: ''
      });
    }
    setIsEditing(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Tela de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">LegadoBox</h1>
              <p className="text-white/80 text-sm">Meu Perfil</p>
            </div>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Page Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">👤 Meu Perfil</h2>
            <p className="text-xl text-gray-600">Gerencie suas informações pessoais</p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <X className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{user?.name || 'Usuário'}</h3>
                    <p className="text-white/80">{user?.email || 'email@exemplo.com'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCancel}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-white text-indigo-600 hover:bg-white/90 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Seu nome completo"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    CPF
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', formatPhone(e.target.value))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>

                {/* Endereço */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Rua, número, bairro, cidade - UF"
                  />
                </div>
              </div>

              {/* Password Section */}
              {isEditing && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Alterar Senha
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Deixe em branco se não quiser alterar a senha
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                          placeholder="Nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.password_confirmation}
                          onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                          placeholder="Confirmar nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
