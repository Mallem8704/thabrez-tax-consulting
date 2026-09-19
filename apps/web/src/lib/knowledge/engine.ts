/**
 * Universal Knowledge Bank Engine
 * Provides resilient document query, search, filtering, and normalization
 * with automatic fallback to verified seed data.
 */

import {
  KnowledgeCategoryDto,
  KnowledgeDocumentDto,
  ComplianceDeadlineItemDto,
  TaxRateItemDto,
  ReviewStatus,
} from '@thabrez/types';
import {
  SEED_CATEGORIES,
  SEED_DOCUMENTS,
  SEED_COMPLIANCE_DEADLINES,
  SEED_TAX_RATES,
  ALL_FORM_SUBSECTORS,
  ALL_RULE_SUBSECTORS,
  ALL_ACT_SUBSECTORS,
  ALL_GOV_LINKS,
  ALL_UTILITIES,
  SubSectorMeta,
  GovLinkItem,
  UtilityItem,
} from './data/seed-knowledge';

export interface KnowledgeFilterOptions {
  q?: string | undefined;
  category?: string | undefined;
  subSector?: string | undefined;
  documentType?: string | undefined;
  authority?: string | undefined;
  financialYear?: string | undefined;
  status?: string | undefined;
  isFeatured?: boolean | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface KnowledgeSearchResponse {
  documents: KnowledgeDocumentDto[];
  total: number;
  query: string;
  categories: KnowledgeCategoryDto[];
}

export class KnowledgeBankEngine {
  /**
   * Retrieves all active knowledge categories with document counts.
   */
  static getCategories(): KnowledgeCategoryDto[] {
    return SEED_CATEGORIES.map((cat) => {
      const docCount = SEED_DOCUMENTS.filter(
        (doc) => doc.categoryId === cat.id && doc.reviewStatus === ReviewStatus.PUBLISHED,
      ).length;
      return {
        ...cat,
        docCount,
      };
    });
  }

  /**
   * Retrieves sub-sectors by category type (forms, rules, acts).
   */
  static getSubsectors(category?: 'forms' | 'rules' | 'acts'): SubSectorMeta[] {
    if (category === 'forms') return ALL_FORM_SUBSECTORS;
    if (category === 'rules') return ALL_RULE_SUBSECTORS;
    if (category === 'acts') return ALL_ACT_SUBSECTORS;
    return [...ALL_FORM_SUBSECTORS, ...ALL_RULE_SUBSECTORS, ...ALL_ACT_SUBSECTORS];
  }

  /**
   * Retrieves official government portal directory links.
   */
  static getGovLinks(): GovLinkItem[] {
    return ALL_GOV_LINKS;
  }

  /**
   * Retrieves official offline utilities and schema downloads.
   */
  static getUtilities(): UtilityItem[] {
    return ALL_UTILITIES;
  }

  /**
   * Queries documents with multi-faceted filtering and full-text keyword ranking.
   */
  static queryDocuments(options: KnowledgeFilterOptions = {}): {
    documents: KnowledgeDocumentDto[];
    total: number;
  } {
    const {
      q = '',
      category,
      subSector,
      documentType,
      authority,
      financialYear,
      status,
      isFeatured,
      limit = 50,
      offset = 0,
    } = options;

    const queryClean = q.trim().toLowerCase();

    const filtered = SEED_DOCUMENTS.filter((doc) => {
      // Only published items in public views
      if (doc.reviewStatus !== ReviewStatus.PUBLISHED) return false;

      // Sub-sector filter
      if (subSector && subSector !== 'ALL') {
        if (doc.subSector?.toLowerCase() !== subSector.toLowerCase()) return false;
      }

      // Category filter (by id or slug)
      if (category && category !== 'ALL') {
        const catObj = SEED_CATEGORIES.find(
          (c) => c.slug.toLowerCase() === category.toLowerCase() || c.id === category,
        );
        if (catObj && doc.categoryId !== catObj.id) return false;
      }

      // Document Type filter
      if (documentType && documentType !== 'ALL') {
        if (doc.documentType.toUpperCase() !== documentType.toUpperCase()) return false;
      }

      // Authority filter
      if (authority && authority !== 'ALL') {
        if (doc.authority.toUpperCase() !== authority.toUpperCase()) return false;
      }

      // Financial Year
      if (financialYear && financialYear !== 'ALL') {
        if (doc.financialYear && !doc.financialYear.includes(financialYear)) return false;
      }

      // Status
      if (status && status !== 'ALL') {
        if (doc.status.toUpperCase() !== status.toUpperCase()) return false;
      }

      // Featured flag
      if (isFeatured !== undefined && doc.isFeatured !== isFeatured) {
        return false;
      }

      // Full-text & Keyword Search matching
      if (queryClean) {
        const titleMatch = doc.title.toLowerCase().includes(queryClean);
        const summaryMatch = doc.summary?.toLowerCase().includes(queryClean) || false;
        const contentMatch = doc.content?.toLowerCase().includes(queryClean) || false;
        const docNumMatch = doc.documentNumber?.toLowerCase().includes(queryClean) || false;
        const formCodeMatch = doc.formCode?.toLowerCase().includes(queryClean) || false;
        const categoryMatch = doc.categoryName?.toLowerCase().includes(queryClean) || false;
        const authorityMatch = doc.authority.toLowerCase().includes(queryClean);

        // Special tax alias matching (e.g. "194Q", "115BAC", "87A", "GSTR 3B", "DIR-3")
        const isAliasMatch =
          (queryClean.includes('194') && (doc.title.includes('194') || (doc.content?.includes('194') ?? false))) ||
          (queryClean.includes('115bac') && (doc.title.includes('115BAC') || (doc.content?.includes('115BAC') ?? false))) ||
          (queryClean.includes('gstr') && (doc.title.includes('GSTR') || (doc.summary?.includes('GSTR') ?? false)));

        if (
          !titleMatch &&
          !summaryMatch &&
          !contentMatch &&
          !docNumMatch &&
          !formCodeMatch &&
          !categoryMatch &&
          !authorityMatch &&
          !isAliasMatch
        ) {
          return false;
        }
      }

      return true;
    });

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      documents: paginated,
      total,
    };
  }

  /**
   * Finds a specific document by its unique slug.
   */
  static getDocumentBySlug(slug: string): KnowledgeDocumentDto | null {
    const doc = SEED_DOCUMENTS.find((d) => d.slug === slug);
    return doc || null;
  }

  /**
   * Retrieves active compliance calendar deadlines with optional category filter.
   */
  static getComplianceDeadlines(category?: string): ComplianceDeadlineItemDto[] {
    if (!category || category === 'ALL') {
      return SEED_COMPLIANCE_DEADLINES;
    }
    return SEED_COMPLIANCE_DEADLINES.filter(
      (d) => d.category.toUpperCase() === category.toUpperCase(),
    );
  }

  /**
   * Retrieves tax rate cards grouped by statutory tax type.
   */
  static getTaxRates(taxType?: string): TaxRateItemDto[] {
    if (!taxType || taxType === 'ALL') {
      return SEED_TAX_RATES;
    }
    return SEED_TAX_RATES.filter(
      (r) => r.taxType.toUpperCase() === taxType.toUpperCase(),
    );
  }

  /**
   * Returns recent regulatory amendments for "What Changed?" diff views.
   */
  static getRecentAmendments(): Array<{
    document: KnowledgeDocumentDto;
    amendment: NonNullable<KnowledgeDocumentDto['amendments']>[0];
  }> {
    const amendments: Array<{
      document: KnowledgeDocumentDto;
      amendment: NonNullable<KnowledgeDocumentDto['amendments']>[0];
    }> = [];

    for (const doc of SEED_DOCUMENTS) {
      if (doc.amendments && doc.amendments.length > 0) {
        for (const amend of doc.amendments) {
          amendments.push({ document: doc, amendment: amend });
        }
      }
    }

    return amendments;
  }
}
