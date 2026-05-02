import { githubProjects, type GitHubProjectConfig } from "../data/projects";

export type GitHubProject = GitHubProjectConfig & {
  url: string;
  homepage: string;
  language: string;
  stargazersCount: number;
  updatedAt: string;
};

type GitHubRepoResponse = {
  html_url?: string;
  homepage?: string | null;
  language?: string | null;
  stargazers_count?: number;
  updated_at?: string;
};

function fallbackProject(project: GitHubProjectConfig): GitHubProject {
  return {
    ...project,
    url: `https://github.com/Focusmee/${project.repo}`,
    homepage: "",
    language: "",
    stargazersCount: 0,
    updatedAt: ""
  };
}

async function fetchGitHubProject(
  project: GitHubProjectConfig
): Promise<GitHubProject> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/Focusmee/${project.repo}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "Blooming-Logs"
        }
      }
    );

    if (!response.ok) {
      return fallbackProject(project);
    }

    const repo = (await response.json()) as GitHubRepoResponse;

    return {
      ...project,
      url: repo.html_url || `https://github.com/Focusmee/${project.repo}`,
      homepage: repo.homepage || "",
      language: repo.language || "",
      stargazersCount: repo.stargazers_count || 0,
      updatedAt: repo.updated_at || ""
    };
  } catch {
    return fallbackProject(project);
  }
}

export async function getGitHubProjects() {
  return Promise.all(githubProjects.map((project) => fetchGitHubProject(project)));
}

