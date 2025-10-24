import { generateRecurringTasks, validateRecurringConfig } from '../recurringTasks';

// Mock Task interface for testing
interface MockTask {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  scheduledDate: string;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    endDate?: string;
    count?: number;
  };
}

describe('Recurring Tasks', () => {
  const baseTask: Omit<MockTask, "id"> = {
    title: "Test Task",
    description: "A test task",
    priority: "medium",
    scheduledDate: "2025-01-01",
  };

  describe('generateRecurringTasks', () => {
    it('should generate daily recurring tasks', () => {
      const recurringData = {
        frequency: "daily" as const,
        interval: 1,
        count: 3,
      };

      const tasks = generateRecurringTasks(baseTask, recurringData, "2025-01-01");
      
      expect(tasks).toHaveLength(3);
      expect(tasks[0].scheduledDate).toBe("2025-01-01");
      expect(tasks[1].scheduledDate).toBe("2025-01-02");
      expect(tasks[2].scheduledDate).toBe("2025-01-03");
      expect(tasks[0].recurringGroupId).toBeDefined();
      expect(tasks[0].recurring).toBeUndefined(); // Should be removed from instances
    });

    it('should generate weekly recurring tasks', () => {
      const recurringData = {
        frequency: "weekly" as const,
        interval: 1,
        count: 2,
      };

      const tasks = generateRecurringTasks(baseTask, recurringData, "2025-01-01");
      
      expect(tasks).toHaveLength(2);
      expect(tasks[0].scheduledDate).toBe("2025-01-01");
      expect(tasks[1].scheduledDate).toBe("2025-01-08");
    });

    it('should generate monthly recurring tasks', () => {
      const recurringData = {
        frequency: "monthly" as const,
        interval: 1,
        count: 2,
      };

      const tasks = generateRecurringTasks(baseTask, recurringData, "2025-01-01");
      
      expect(tasks).toHaveLength(2);
      expect(tasks[0].scheduledDate).toBe("2025-01-01");
      expect(tasks[1].scheduledDate).toBe("2025-02-01");
    });

    it('should respect end date', () => {
      const recurringData = {
        frequency: "daily" as const,
        interval: 1,
        endDate: "2025-01-03",
      };

      const tasks = generateRecurringTasks(baseTask, recurringData, "2025-01-01");
      
      expect(tasks).toHaveLength(3);
      expect(tasks[2].scheduledDate).toBe("2025-01-03");
    });

    it('should cap at 52 occurrences for never-ending tasks', () => {
      const recurringData = {
        frequency: "daily" as const,
        interval: 1,
        // No end date or count specified
      };

      const tasks = generateRecurringTasks(baseTask, recurringData, "2025-01-01");
      
      expect(tasks).toHaveLength(52);
    });
  });

  describe('validateRecurringConfig', () => {
    it('should validate interval', () => {
      const config = {
        frequency: "daily" as const,
        interval: 0,
        count: 5,
      };

      const errors = validateRecurringConfig(config);
      expect(errors).toContain("Interval must be at least 1");
    });

    it('should validate count', () => {
      const config = {
        frequency: "daily" as const,
        interval: 1,
        count: 100,
      };

      const errors = validateRecurringConfig(config);
      expect(errors).toContain("Count must be between 1 and 52");
    });

    it('should not allow both end date and count', () => {
      const config = {
        frequency: "daily" as const,
        interval: 1,
        endDate: "2025-01-10",
        count: 5,
      };

      const errors = validateRecurringConfig(config);
      expect(errors).toContain("Cannot specify both end date and count");
    });

    it('should validate end date is in future', () => {
      const config = {
        frequency: "daily" as const,
        interval: 1,
        endDate: "2020-01-01",
      };

      const errors = validateRecurringConfig(config);
      expect(errors).toContain("End date must be in the future");
    });

    it('should pass validation for valid config', () => {
      const config = {
        frequency: "weekly" as const,
        interval: 2,
        count: 10,
      };

      const errors = validateRecurringConfig(config);
      expect(errors).toHaveLength(0);
    });
  });
});
