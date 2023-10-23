export const genericHandleSelectAllClick = (rowData: any[], setSelected: (s: any[]) => void) =>
  (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      const newSelecteds = rowData.map((r: any) => r.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

export const genericHandleRowClick = (selected: any[], setSelected: (s: any[]) => void) =>
  (event: any, id: string): void => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }
