import MainAccount from "../../../components/account/accountMain"

export type PramsPropsTypes = {
    params: Promise<{
        slug: string[]
    }>
}

const page = async ({ params }: PramsPropsTypes) => {
    const resolvedParams = await params;
    return (
        <div>
            <MainAccount items={resolvedParams} />
        </div>
    )
}

export default page;