import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { InquiryRecord } from "@/lib/types";

export interface InquiryRepository {
  create(record: InquiryRecord): Promise<InquiryRecord>;
}

class JsonFileInquiryRepository implements InquiryRepository {
  private readonly filePath = path.join(process.cwd(), ".data", "inquiries.json");

  async create(record: InquiryRecord): Promise<InquiryRecord> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    const records = await this.readAll();
    records.push(record);
    await writeFile(this.filePath, JSON.stringify(records, null, 2), "utf8");
    return record;
  }

  private async readAll(): Promise<InquiryRecord[]> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      return JSON.parse(raw) as InquiryRecord[];
    } catch {
      return [];
    }
  }
}

export const inquiryRepository: InquiryRepository = new JsonFileInquiryRepository();
