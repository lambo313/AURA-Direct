import { getUserId } from "@/lib/utils";

export const GET = async (req: Request, res: Response) => {
  try {
    // Run your server-side function to get the email
    const userId = await getUserId();

    // Return the email as JSON response
    return new Response(JSON.stringify(userId), { status: 200 });
  } catch (error) {
    console.error('Error fetching email:', error);
    return new Response('Failed to fetch email', { status: 500 })
  }
}
