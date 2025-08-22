// Data Provider Combinado - Combina el data provider principal con el custom
import type { DataProvider } from "@refinedev/core";
import { dataProvider as mainDataProvider } from "./index";
import { dataProviderCustom } from "./dataProviderCustom";
import { DATA_PROVIDER_CUSTOM_CONFIG } from "./configCustom";

// Lista de recursos que maneja el data provider custom
const CUSTOM_RESOURCES = Object.values(DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_RESOURCES);

export const combinedDataProvider: DataProvider = {
  // Función para determinar qué data provider usar
//   getDataProvider: (resource: string) => {
//     return CUSTOM_RESOURCES.includes(resource as any) ? dataProviderCustom : mainDataProvider;
//   },

  getList: async (params) => {
    const provider = CUSTOM_RESOURCES.includes(params.resource as any) 
      ? dataProviderCustom 
      : mainDataProvider;
    return provider.getList(params);
  },

  getOne: async (params) => {
    const provider = CUSTOM_RESOURCES.includes(params.resource as any) 
      ? dataProviderCustom 
      : mainDataProvider;
    return provider.getOne(params);
  },

  create: async (params) => {
    const provider = CUSTOM_RESOURCES.includes(params.resource as any) 
      ? dataProviderCustom 
      : mainDataProvider;
    return provider.create(params);
  },

  update: async (params) => {
    const provider = CUSTOM_RESOURCES.includes(params.resource as any) 
      ? dataProviderCustom 
      : mainDataProvider;
    return provider.update(params);
  },

  deleteOne: async (params) => {
    const provider = CUSTOM_RESOURCES.includes(params.resource as any) 
      ? dataProviderCustom 
      : mainDataProvider;
    return provider.deleteOne(params);
  },

  getMany: async (params) => {
    const provider = CUSTOM_RESOURCES.includes(params.resource as any) 
      ? dataProviderCustom 
      : mainDataProvider;
    if (!provider || !provider.getMany) {
      throw new Error(`No se encontró el proveedor para el recurso: ${params.resource}`);
    }
    return provider.getMany(params);
  },

  createMany: async (params) => {
    const provider = CUSTOM_RESOURCES.includes(params.resource as any) 
      ? dataProviderCustom 
      : mainDataProvider;
    if (!provider || !provider.createMany) {
      throw new Error(`No se encontró el proveedor para el recurso: ${params.resource}`);
    }
    return provider.createMany(params);
  },

  updateMany: async (params) => {
    const provider = CUSTOM_RESOURCES.includes(params.resource as any) 
      ? dataProviderCustom 
      : mainDataProvider;
    if (!provider || !provider.updateMany) {
      throw new Error(`No se encontró el proveedor para el recurso: ${params.resource}`);
    }
    return provider.updateMany(params);
  },

  deleteMany: async (params) => {
    const provider = CUSTOM_RESOURCES.includes(params.resource as any) 
      ? dataProviderCustom 
      : mainDataProvider;
    if (!provider || !provider.deleteMany) {
      throw new Error(`No se encontró el proveedor para el recurso: ${params.resource}`);
    }
    return provider.deleteMany(params);
  },

  custom: async (params) => {

    // Obtener el recurso de los metadatos
    let resource = "unknown";
    if (params.meta && params.meta.resource) {
        resource = params.meta.resource;
    }
    
    // Para endpoints custom, intentamos primero con el custom provider
    try {
      if (!dataProviderCustom || !dataProviderCustom.custom) {
        throw new Error(`No se encontró el proveedor para el recurso: ${resource}`);
      }
      return await dataProviderCustom.custom(params);
    } catch (error) {
      // Si falla, intentamos con el main provider
      if (!mainDataProvider || !mainDataProvider.custom) {
        throw new Error(`No se encontró el proveedor para el recurso: ${resource}`);
      }
      return await mainDataProvider.custom(params);
    }
  },

  getApiUrl: () => {
    // Usar la URL del main provider por defecto
    return mainDataProvider.getApiUrl();
  },
};

export default combinedDataProvider;
