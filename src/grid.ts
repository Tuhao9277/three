interface TilePrimitive {
  x: number
  y: number
  id: string
  value: number
  merged: boolean
  changed: boolean
}
export default class Grid {
  private tiles: TilePrimitive[] = []

  private size: number

  constructor(size: number) {
    this.size = size
  }
  eachTile(func: (tile: TilePrimitive) => void) {
    for (let i = 0; i < this.tiles.length; i++) {
      const element = this.tiles[i]
      func(element)
    }
  }

  // 遍历每行
  eachRow(func: (tiles: TilePrimitive[]) => void) {
    for (let y = 0; y < this.size; y++) {
      const row = this.tiles.filter(tile => tile.y === y)
      func(row)
    }
  }

  // 遍历每列
  eachColumn(func: (tiles: TilePrimitive[]) => void) {
    for (let x = 0; x < this.size; x++) {
      const row = this.tiles.filter(tile => tile.x === x)
      func(row)
    }
  }
  resetTiles() {
    this.tiles = []
  }
  removeTile(tile: TilePrimitive) {
    this.tiles.splice(this.tiles.indexOf(tile), 1)
  }
  addTile(tile: TilePrimitive) {
    this.tiles.push(tile)
  }
  setTileX(tile: TilePrimitive, x: number) {
    if (tile.x !== x) {
      tile.changed = true
      tile.x = x
    }
  }
  setTileY(tile: TilePrimitive, y: number) {
    if (tile.y !== y) {
      tile.changed = true
      tile.y = y
    }
  }
  // 是否可合并
  isMergable(tile: TilePrimitive) {
    const right = this.tiles.find(closeTile => closeTile.x === tile.x + 1)
    const left = this.tiles.find(closeTile => closeTile.x === tile.x - 1)
    const up = this.tiles.find(closeTile => closeTile.y === tile.y + 1)
    const down = this.tiles.find(closeTile => closeTile.y === tile.y - 1)
    if (
      (right && right.value === tile.value) ||
      (left && left.value === tile.value) ||
      (up && up.value === tile.value) ||
      (down && down.value === tile.value)
    ) {
      return true
    } else {
      return false
    }
  }
  isPlayable() {
    if (this.tiles.length >= this.size ** 2) {
      return this.tiles.some(tile => {
        return this.isMergable(tile)
      })
    }
    return true
  }
  hasChanged() {
    return this.tiles.some(tile => tile.changed)
  }
  // 合并方法
  merge(baseTile: TilePrimitive, mergedTile: TilePrimitive) {
    baseTile.value *= 2
    baseTile.merged = true
    mergedTile.merged = true
    this.setTileX(mergedTile, baseTile.x)
    this.setTileY(mergedTile, baseTile.y)
    this.removeTile(mergedTile)
  }
  getEmpty() {
    const empty: { x: number; y: number }[] = []
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const isEmpty = !this.tiles.find(tile => tile.x === x && tile.y === y)
        if (isEmpty) empty.push({ x, y })
      }
    }
    return empty
  }
  getTiles() {
    return this.tiles
  }
}
