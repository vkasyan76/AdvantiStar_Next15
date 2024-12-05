import { Editor } from "./editor";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  // const awaitedParams = await params;
  // const documentId = awaitedParams.documentId;

  const { documentId } = await params;

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      {/* <h1>Document ID: {documentId}</h1> */}
      <Editor />
    </div>
  );
};

export default DocumentIdPage;
