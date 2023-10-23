import React, { ChangeEvent, FormEvent, useState } from 'react'
import {
  Box,
  Button,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { v4 as uuidv4 } from 'uuid'

import { StatusCost } from '../../../../services/financials/types'

import CostRow, { CostRowDataProps } from './CostRow'

export type Cost = Omit<StatusCost, 'costId'> & {costId: string; new?: boolean; shouldUpdate?: boolean}

interface CostsProps {
  statusId: string;
  costs: Cost[];
  setCosts: (costs: Cost[]) => void;
}

const Costs = ({ statusId, costs, setCosts }: CostsProps) => {
  // const [_costs, _setCosts] = useState<Cost[]>(costs)

  const addNewCost = () => {
    const newCost = { statusId, value: 0, currency: 'CHF' as any, costId: uuidv4(), new: true }
    setCosts([
      ...costs,
      newCost,
    ])
  }

  const removeCost = (id?: string) => () => {
    setCosts([
      ...costs.filter((e) => e.costId !== id),
    ])
  }

  const updateCost = (id?: string) => (cost: CostRowDataProps) => {
    setCosts(costs.map((e) => e.costId === id
      ? {
          ...e,
          value: cost.cost,
          currency: cost.currency as any,
          invoicedAt: cost.invoicedAt,
          reason: cost.reason,
          shouldUpdate: cost.shouldUpdate,
        }
      : e),
    )
  }

  // const onSubmit = () => {
  //   const _existing = costs

  //   const toAdd = _costs.filter(e => e.new)
  //   const toUpdate = _costs.filter(e => _existing.map(e2 => e2.costId).includes(e.costId)).filter(e => e.shouldUpdate)
  //   const toRemove = _existing.filter(e => !_costs.map(e2 => e2.costId).includes(e.costId))
  // }

  return (
    <Box >
      {costs.map((cost, idx) => (
        <CostRow key={cost.costId} cost={cost.value} currency={cost.currency as any} invoicedAt={cost.invoicedAt} reason={cost.reason} onRemove={removeCost(cost.costId)} onUpdate={updateCost(cost.costId)}/>
      ))}
      <Button variant="text" onClick={() => addNewCost()}><AddIcon/>Add more costs</Button>
    </Box>
  )
}

export default Costs
