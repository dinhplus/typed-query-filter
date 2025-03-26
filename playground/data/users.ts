export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  address: {
    street: string;
    city: string;
    country: string;
  };
  tags: string[];
  isActive: boolean;
  joinDate: Date;
  posts?: {
    title: string; likes: number,
    details: {
      comments: {
        user: string, text:
        string
      }[],
      tags: string[],
      published: boolean,
      publishedDate: Date | undefined,
      views: number,
      content: string
    }
  }[];
}

export const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 28,
    address: {
      street: '123 Main St',
      city: 'New York',
      country: 'USA'
    },
    tags: ['developer', 'javascript'],
    isActive: true,
    joinDate: new Date('2020-01-15'),
    posts: [
      {
        title: 'First Post', likes: 10,
        details: {
          comments: [],
          tags: ['developer', 'javascript'],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      },
      {
        title: 'Second Post', likes: 20,
        details: {
          comments: [],
          tags: [],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 24,
    address: {
      street: '456 Park Ave',
      city: 'Boston',
      country: 'USA'
    },
    tags: ['designer', 'ui/ux'],
    isActive: true,
    joinDate: new Date('2021-03-20'),
    posts: [
      {
        title: 'First Post', likes: 10,
        details: {
          comments: [],
          tags: ['design', 'ui'],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      },
      {
        title: 'Second Post', likes: 20,
        details: {
          comments: [],
          tags: [],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      }
    ]
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    age: 32,
    address: {
      street: '789 Elm St',
      city: 'San Francisco',
      country: 'USA'
    },
    tags: ['developer', 'python', 'data-science'],
    isActive: false,
    joinDate: new Date('2019-11-05'),
    posts: [
      {
        title: 'First Post', likes: 10,
        details: {
          comments: [],
          tags: [],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      },
      {
        title: 'Second Post', likes: 20,
        details: {
          comments: [],
          tags: ["python", "data-science"],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      }
    ]
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    age: 27,
    address: {
      street: '101 Oak St',
      city: 'Chicago',
      country: 'USA'
    },
    tags: ['marketer', 'content'],
    isActive: true,
    joinDate: new Date('2022-02-10'),
    posts: [
      {
        title: 'First Post', likes: 10,
        details: {
          comments: [],
          tags: [],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      },
      {
        title: 'Second Post', likes: 20,
        details: {
          comments: [],
          tags: [],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      }
    ]
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@example.com',
    age: 35,
    address: {
      street: '202 Pine St',
      city: 'Seattle',
      country: 'USA'
    },
    tags: ['developer', 'java', 'architect'],
    isActive: true,
    joinDate: new Date('2018-07-22'),
    posts: [
      {
        title: 'First Post', likes: 10,
        details: {
          comments: [],
          tags: [],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      },
      {
        title: 'Second Post', likes: 20,
        details: {
          comments: [],
          tags: [],
          published: false,
          publishedDate: undefined,
          views: 0,
          content: ""
        }
      }
    ]
  }
];
