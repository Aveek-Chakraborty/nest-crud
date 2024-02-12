import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { FeedPost } from './models/post.interface';
import { Observable, of } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Repository } from 'typeorm';
import { FeedPostEntity } from './models/post.entity';

describe('FeedController', () => {
  let controller: FeedController;
  let feedService: FeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,
        {
          provide: getRepositoryToken(FeedPostEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<FeedController>(FeedController);
    feedService = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const mockPost: FeedPost = { id: 1, body: 'Mock Content' };
      const savedPost: FeedPost = { ...mockPost }; 
      jest.spyOn(feedService, 'createPost').mockReturnValue(of(savedPost));

      const result: Observable<FeedPost> = controller.create(mockPost);
      await expect(result.toPromise()).resolves.toEqual(savedPost);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const mockPosts: FeedPost[] = [{ id: 1, body: 'Mock Content 1' }, { id: 2, body: 'Mock Content 2' }];
      jest.spyOn(feedService, 'findAllPosts').mockReturnValue(of(mockPosts));

      const result: Observable<FeedPost[]> = controller.findAll();
      await expect(result.toPromise()).resolves.toEqual(mockPosts);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const mockPost: FeedPost = { id: 1, body: 'Mock Content' };
      const updatedPost: UpdateResult = { raw: [], affected: 1, generatedMaps: [] };
      jest.spyOn(feedService, 'updatePost').mockReturnValue(of(updatedPost));

      const result: Observable<UpdateResult> = controller.update(mockPost, 1); 
      await expect(result.toPromise()).resolves.toEqual(updatedPost);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const postId = 1; // Assuming 1 is the id
      const deleteResult: DeleteResult = { raw: [], affected: 1 };
      jest.spyOn(feedService, 'deletePost').mockReturnValue(of(deleteResult));

      const result: Observable<DeleteResult> = controller.delete(postId);
      await expect(result.toPromise()).resolves.toEqual(deleteResult);
    });
  });

  describe('getById', () => {
    it('should return a post by id', async () => {
      const postId = 1; 
      const mockPost: FeedPost = { id: 1, body: 'Mock Content' };
      jest.spyOn(feedService, 'getbyid').mockReturnValue(of(mockPost));

      const result: Observable<FeedPost> = controller.getById(postId);
      await expect(result.toPromise()).resolves.toEqual(mockPost);
    });
  });
});
