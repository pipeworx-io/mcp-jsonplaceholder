interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * JSONPlaceholder MCP — wraps JSONPlaceholder fake REST API (free, no auth)
 *
 * Useful for testing, prototyping, and demonstrating API integrations.
 * Base: https://jsonplaceholder.typicode.com
 *
 * Tools:
 * - get_posts: List fake blog posts
 * - get_post: Get a single post by ID
 * - get_users: List fake users with contact and address info
 * - get_comments: Get comments for a specific post
 */


const BASE_URL = 'https://jsonplaceholder.typicode.com';

type RawPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type RawUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string; bs: string };
};

type RawComment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

const tools: McpToolExport['tools'] = [
  {
    name: 'get_posts',
    description:
      'Retrieve a list of fake blog posts from JSONPlaceholder. Useful for prototyping and testing. Returns post ID, user ID, title, and body text.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of posts to return (default 10, max 100).',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_post',
    description:
      'Retrieve a single fake blog post by its ID from JSONPlaceholder. Returns post ID, user ID, title, and body text.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Post ID to retrieve (1–100).',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_users',
    description:
      'Retrieve a list of fake users from JSONPlaceholder. Returns name, username, email, address, phone, website, and company details.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_comments',
    description:
      'Retrieve comments for a specific fake blog post from JSONPlaceholder. Returns comment ID, commenter name, email, and body text.',
    inputSchema: {
      type: 'object',
      properties: {
        post_id: {
          type: 'number',
          description: 'Post ID whose comments to retrieve (1–100).',
        },
      },
      required: ['post_id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_posts':
      return getPosts((args.limit as number | undefined) ?? 10);
    case 'get_post':
      return getPost(args.id as number);
    case 'get_users':
      return getUsers();
    case 'get_comments':
      return getComments(args.post_id as number);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getPosts(limit: number) {
  const params = new URLSearchParams({ _limit: String(Math.min(limit, 100)) });
  const res = await fetch(`${BASE_URL}/posts?${params}`);
  if (!res.ok) throw new Error(`JSONPlaceholder API error: ${res.status}`);
  const data = (await res.json()) as RawPost[];
  return {
    count: data.length,
    posts: data.map((p) => ({
      id: p.id,
      user_id: p.userId,
      title: p.title,
      body: p.body,
    })),
  };
}

async function getPost(id: number) {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error(`JSONPlaceholder API error: ${res.status}`);
  const p = (await res.json()) as RawPost;
  return {
    id: p.id,
    user_id: p.userId,
    title: p.title,
    body: p.body,
  };
}

async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error(`JSONPlaceholder API error: ${res.status}`);
  const data = (await res.json()) as RawUser[];
  return {
    count: data.length,
    users: data.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      phone: u.phone,
      website: u.website,
      address: {
        street: u.address.street,
        suite: u.address.suite,
        city: u.address.city,
        zipcode: u.address.zipcode,
        geo: { lat: parseFloat(u.address.geo.lat), lng: parseFloat(u.address.geo.lng) },
      },
      company: {
        name: u.company.name,
        catch_phrase: u.company.catchPhrase,
        bs: u.company.bs,
      },
    })),
  };
}

async function getComments(postId: number) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  if (!res.ok) throw new Error(`JSONPlaceholder API error: ${res.status}`);
  const data = (await res.json()) as RawComment[];
  return {
    post_id: postId,
    count: data.length,
    comments: data.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      body: c.body,
    })),
  };
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
