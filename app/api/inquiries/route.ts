
import { NextResponse } from "next/server";
import { createInquiryRecord, validateInquiry } from "@/lib/inquiry";
import { inquiryRepository } from "@/lib/inquiry-repository";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validation = validateInquiry(body);

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const record = createInquiryRecord(validation.value);
  await inquiryRepository.create(record);

  return NextResponse.json({
    reference: record.reference,
    createdAt: record.createdAt,
    status: record.status
  });
}
