import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

export interface Transaction {
  _id: string
  type: 'income' | 'expense'
  amount: number
  description?: string
  category: string
  date: string
  createdAt?: string
  updatedAt?: string
}

export interface TransactionFilters {
  type?: 'income' | 'expense'
  category?: string
  startDate?: string
  endDate?: string
}

export interface CreateTransactionDto {
  type: 'income' | 'expense'
  amount: number
  description?: string
  category: string
  date: string
}

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/transactions',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], TransactionFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams()
        if (filters?.type) params.append('type', filters.type)
        if (filters?.category) params.append('category', filters.category)
        if (filters?.startDate) params.append('startDate', filters.startDate)
        if (filters?.endDate) params.append('endDate', filters.endDate)
        return `?${params.toString()}`
      },
      providesTags: ['Transaction'],
    }),
    createTransaction: builder.mutation<Transaction, CreateTransactionDto>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transaction'],
    }),
    updateTransaction: builder.mutation<Transaction, { id: string; data: Partial<CreateTransactionDto> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Transaction'],
    }),
    deleteTransaction: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction'],
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi

