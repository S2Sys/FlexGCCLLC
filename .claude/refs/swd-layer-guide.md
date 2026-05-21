---
name: swd-layer-guide
description: Framework-specific layer guidance for /swd-start and /swd-next. Reference file loaded on demand — not a standalone skill.
---

# Framework-Specific Layer Guidance

> This file is referenced by `/swd-start` and `/swd-next`. Load it when detailed layer-specific patterns are needed.

Output detailed guidance based on the framework selected in STEP 0:

---

### IF Backend:

  REPOSITORY LAYER (Data Access)
  • **Node.js**: src/repositories/[Feature]Repository.ts — class with methods for CRUD + complex queries
  • **Python**: src/repositories/[feature]_repository.py — class or dataclass mapper to ORM models
  • **Go**: internal/repositories/[feature]_repository.go — interface + struct with db/orm methods
  • **Java**: src/main/java/repositories/[Feature]Repository.java — Spring Data JPA or custom queries
  • **.NET**: src/Data/Repositories/[Feature]Repository.cs — async methods using DbContext
  • Purpose: Abstract database access, encapsulate ORM/SQL, return domain entities
  • Testing: Mock database layer, unit test CRUD logic

  SERVICE LAYER (Business Logic)
  • **Node.js**: src/services/[Feature]Service.ts — business rules, validation, orchestration
  • **Python**: src/services/[feature]_service.py — domain logic, transaction handling
  • **Go**: internal/services/[feature]_service.go — interface + impl, call repository layer
  • **Java**: src/main/java/services/[Feature]Service.java — @Service with @Transactional
  • **.NET**: src/Services/[Feature]Service.cs — dependency injection, async operations
  • Purpose: Apply business rules, coordinate multiple repos, implement use cases
  • Testing: Mock repositories, test business logic in isolation

  ENDPOINT LAYER (API Controller)
  • **Node.js**: src/routes/[feature].routes.ts + src/controllers/[Feature]Controller.ts
  • **Python**: src/routes/[feature]_routes.py — Flask/FastAPI route + request handlers
  • **Go**: internal/handlers/[feature]_handler.go — HTTP handler functions
  • **Java**: src/main/java/controllers/[Feature]Controller.java — @RestController with @RequestMapping
  • **.NET**: src/Controllers/[Feature]Controller.cs — ApiController with [HttpGet/Post/Put/Delete]
  • Purpose: HTTP routing, request/response validation, DTOs, error handling
  • Testing: Integration tests with mock HTTP, validate request/response contracts

---

### IF Frontend/React:

  REACT COMPONENT LAYER:
  • Location: src/components/[Feature]/[Feature].tsx
  • Use functional components with hooks — no class components
  • Hooks pattern: useState for local state, useContext/useSelector for shared state
  • Naming: PascalCase component name, match file name
  • Example structure:
    ```
    export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
      const [loading, setLoading] = useState(false);
      const user = useSelector(selectUserById);
      useEffect(() => { /* fetch user data */ }, [userId]);
      return <div>...</div>;
    };
    ```

  REACT HOOK LAYER:
  • Location: src/hooks/use[Feature].ts
  • Custom hooks encapsulate logic reused across components
  • Always use useCallback / useMemo for optimization
  • Return hooks must match component prop interfaces
  • Example: useUserData(userId) returns { user, loading, error }

  REACT CONTEXT/REDUX LAYER:
  • Redux pattern (Redux Toolkit preferred):
    - Slice location: src/store/[feature]Slice.ts
    - Contains: state interface, reducer, async thunks, selectors
    - Always use createSlice, createAsyncThunk from Redux Toolkit
  • Context pattern (lighter state):
    - Location: src/context/[Feature]Context.tsx
    - Pair with custom hook: useContext(hook) for simple shared state

---

### IF Frontend/Vue:

  VUE COMPONENT LAYER:
  • Location: src/components/[Feature].vue
  • Single File Component (SFC) with <template>, <script setup>, <style scoped>
  • Use composition API (script setup) — Options API discouraged
  • Naming: PascalCase file name, import/use in templates
  • Example structure:
    ```vue
    <template>
      <div>{{ user.name }}</div>
    </template>
    <script setup lang="ts">
    const { userId } = defineProps<{ userId: string }>();
    const { user, loading } = await useUserData(userId);
    </script>
    <style scoped>
    div { /* styles */ }
    </style>
    ```

  VUE COMPOSABLE LAYER:
  • Location: src/composables/use[Feature].ts
  • Composables are reusable logic functions (similar to React hooks)
  • Always return reactive() objects and computed() results
  • Example: useUserData(userId) returns { user: Ref, loading: Ref, error: Ref }

  VUE STORE LAYER:
  • Pinia (recommended):
    - Location: src/stores/[feature]Store.ts
    - defineStore('feature', { state, getters, actions })
    - Use useStore() in components
  • Vuex (if required):
    - Location: src/store/modules/[feature].ts
    - Module pattern with state, getters, mutations, actions

---

### IF Frontend/Angular:

  ANGULAR COMPONENT LAYER:
  • Location: src/app/[feature]/[feature].component.ts + .html + .scss
  • Always use standalone: true with imports array (NgModules deprecated)
  • No ChangeDetectionStrategy.OnPush without OnInit — use effect() for reactive updates
  • Dependency injection via constructor — no factory patterns
  • Example:
    ```ts
    @Component({
      selector: 'app-user-profile',
      standalone: true,
      imports: [CommonModule, HttpClientModule],
      template: `<div>{{ user$ | async }}</div>`
    })
    export class UserProfileComponent implements OnInit {
      constructor(private userService: UserService) {}
      user$ = this.userService.getUserData();
    }
    ```

  ANGULAR SERVICE LAYER:
  • Location: src/app/[feature]/services/[feature].service.ts
  • Provides: HTTP calls, data transformation, caching logic
  • Always return Observable<T> — components subscribe
  • Use HttpClient with proper error handling (catchError, throwError)
  • Inject: HttpClient, ICurrentUserService, Logger

  ANGULAR NgRx LAYER:
  • Location: src/app/[feature]/store/
    - [feature].actions.ts
    - [feature].reducer.ts
    - [feature].effects.ts
    - [feature].selectors.ts
  • Actions: createAction() with props for events
  • Effects: createEffect() → dispatch actions on HTTP responses
  • Selectors: createSelector() for computed state slices
  • Store injection: constructor(private store: Store)

---

### IF Mobile/Flutter:

  FLUTTER STATELESS WIDGET LAYER:
  • Location: lib/widgets/[feature]/[feature]_widget.dart
  • Immutable widgets — no state changes
  • Use for: presentational UI, display only
  • Example:
    ```dart
    class UserCard extends StatelessWidget {
      final User user;
      const UserCard({required this.user});
      
      @override
      Widget build(BuildContext context) {
        return Card(child: Text(user.name));
      }
    }
    ```

  FLUTTER STATEFUL WIDGET LAYER:
  • Location: lib/screens/[feature]/[feature]_screen.dart
  • Mutable state via State<T> subclass
  • Use for: forms, animations, local state management
  • Always dispose controllers and subscriptions in dispose()

  FLUTTER BLoC LAYER:
  • Location: lib/bloc/[feature]/[feature]_bloc.dart
  • File structure:
    - [feature]_bloc.dart — BLoC class extending Bloc<Event, State>
    - [feature]_event.dart — sealed events
    - [feature]_state.dart — sealed states
  • Every user action → event → state change
  • Never call dependencies directly in UI — go through BLoC
  • Example:
    ```dart
    class FetchUserEvent extends FetchUserBlocEvent {
      final String userId;
      const FetchUserEvent(this.userId);
    }
    ```

  FLUTTER PROVIDER SERVICE LAYER:
  • Location: lib/services/[feature]_service.dart
  • Lightweight state management (alternative to BLoC)
  • Use: StateNotifier<T> or ChangeNotifier subclass
  • Expose via: final [feature]Provider = StateNotifierProvider(...)
  • Components consume: ref.watch([feature]Provider)

  FLUTTER REPOSITORY LAYER:
  • Location: lib/repositories/[feature]_repository.dart
  • Data access abstraction — HTTP or local DB calls
  • Methods return: Future<T> or Stream<T>
  • Constructor inject: HttpClient, LocalDb, Logger

  DART MODEL LAYER:
  • Location: lib/models/[feature]_model.dart
  • Data classes with @freezed or copyWith pattern
  • Include: toJson() / fromJson() for serialization
  • Use sealed classes for variant types
  • Example:
    ```dart
    @freezed
    class User with _$User {
      const factory User({
        required String id,
        required String name,
      }) = _User;
      factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
    }
    ```
