import { useState, useEffect } from 'react'
import { getLeads, updateLeadStatus } from '@/services/leads'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([])

  const loadData = async () => {
    const data = await getLeads()
    setLeads(data)
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('leads', () => {
    loadData()
  })

  const handleStatusChange = async (id: string, status: string) => {
    await updateLeadStatus(id, status)
    loadData()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Novo</Badge>
      case 'contacted':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Em contato</Badge>
        )
      case 'closed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Fechado</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-3xl font-bold tracking-tight">Gestão de Leads</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Contato</TableHead>
              <TableHead className="font-semibold">Origem</TableHead>
              <TableHead className="font-semibold w-[150px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(lead.created).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div
                      className="text-sm text-gray-500 max-w-[200px] truncate"
                      title={lead.message}
                    >
                      {lead.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phone || '-'}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {lead.source_page || 'Direto'}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(val) => handleStatusChange(lead.id, val)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs font-medium bg-gray-50">
                        <SelectValue>{getStatusBadge(lead.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="contacted">Em contato</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
