import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Prisma Schema Validation', () => {
  it('should have isAdmin field in User model', () => {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

    // Check that User model exists
    expect(schemaContent).toContain('model User {')

    // Check that isAdmin field is defined
    expect(schemaContent).toMatch(/isAdmin\s+Boolean/)

    // Check that it has a default value
    expect(schemaContent).toMatch(/isAdmin\s+Boolean\s+@default\(false\)/)
  })

  it('should have required User fields', () => {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

    const requiredFields = [
      'id',
      'email',
      'password',
      'name',
      'isAdmin',
      'createdAt',
      'updatedAt',
    ]

    requiredFields.forEach((field) => {
      expect(schemaContent).toContain(field)
    })
  })

  it('should have Story model with published field', () => {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

    expect(schemaContent).toContain('model Story {')
    expect(schemaContent).toMatch(/published\s+Boolean/)
  })

  it('should have Favorite model with proper relations', () => {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

    expect(schemaContent).toContain('model Favorite {')
    expect(schemaContent).toMatch(/userId\s+String/)
    expect(schemaContent).toMatch(/storyId\s+String/)
    expect(schemaContent).toMatch(/@@unique\(\[userId, storyId\]\)/)
  })
})
