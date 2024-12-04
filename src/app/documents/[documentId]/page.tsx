interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  // const awaitedParams = await params;
  // const documentId = awaitedParams.documentId;

  const { documentId } = await params;

  return (
    <div>
      <h1>Document ID: {documentId}</h1>
    </div>
  );
};

export default DocumentIdPage;
