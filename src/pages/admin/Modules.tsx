import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getModules, Module } from '@/services/modules'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'

export default function AdminModules() {
  const [modules, setModules] = useState<Module[]>([])

  const loadData = async () => setModules(await getModules())
  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Módulos do ERP</h2>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-semibold w-24 text-center">Ordem</TableHead>
              <TableHead className="font-semibold">Módulo</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">Slug</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-center font-medium text-gray-500">{m.order}</TableCell>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="text-gray-500 hidden md:table-cell">{m.slug}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <Link to={`/admin/modules/${m.id}`}>
                      <Edit2 className="w-3 h-3 mr-2" /> Gerenciar
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
